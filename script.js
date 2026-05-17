(async function () {
  console.log("Starting PDF generator...");

  // Load jsPDF safely with Trusted Types support
  if (!window.jspdf) {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");

      const scriptURL =
        "https://unpkg.com/jspdf@latest/dist/jspdf.umd.min.js";

      // Trusted Types / CSP support
      if (window.trustedTypes?.createPolicy) {
        const policy = trustedTypes.createPolicy("jspdf-loader", {
          createScriptURL: (url) => url,
        });

        script.src = policy.createScriptURL(scriptURL);
      } else {
        script.src = scriptURL;
      }

      script.onload = resolve;
      script.onerror = reject;

      document.head.appendChild(script);
    });
  }

  const { jsPDF } = window.jspdf;

  console.log("Scanning images...");

  // Find Google Drive blob images
  let validImgs = [...document.images].filter((img) =>
    img.src.startsWith("blob:https://drive.google.com/")
  );

  // Sort images top-to-bottom for correct page order
  validImgs.sort(
    (a, b) =>
      a.getBoundingClientRect().top -
      b.getBoundingClientRect().top
  );

  if (!validImgs.length) {
    console.log("No valid images found.");
    return;
  }

  console.log(`${validImgs.length} pages found`);

  let pdf = null;

  // Reuse one canvas for better memory performance
  const canvas = document.createElement("canvas");

  const ctx = canvas.getContext("2d", {
    alpha: false,
    willReadFrequently: false,
  });

  for (let i = 0; i < validImgs.length; i++) {
    const img = validImgs[i];

    // Skip invalid images
    if (!img.naturalWidth || !img.naturalHeight) {
      console.warn(`Skipping invalid image ${i + 1}`);
      continue;
    }

    const width = img.naturalWidth;
    const height = img.naturalHeight;

    const orientation =
      width > height ? "landscape" : "portrait";

    // Resize reusable canvas
    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    // Draw image
    ctx.drawImage(img, 0, 0, width, height);

    // JPEG gives MUCH smaller PDFs
    const imgData = canvas.toDataURL(
      "image/jpeg",
      0.95
    );

    // Create or add PDF page
    if (!pdf) {
      pdf = new jsPDF({
        orientation,
        unit: "px",
        format: [width, height],
        compress: true,
      });
    } else {
      pdf.addPage([width, height], orientation);
    }

    // Add image
    pdf.addImage(
      imgData,
      "JPEG",
      0,
      0,
      width,
      height,
      undefined,
      "FAST"
    );

    const percent = Math.round(
      ((i + 1) / validImgs.length) * 100
    );

    console.log(
      `Processed ${i + 1}/${validImgs.length} (${percent}%)`
    );

    // Prevent browser freezing on huge PDFs
    await new Promise((r) => setTimeout(r, 0));
  }

  // Get title safely
  let title =
    document.querySelector('meta[itemprop="name"]')
      ?.content?.trim() ||
    document.title?.trim() ||
    "download";

  if (!title.toLowerCase().endsWith(".pdf")) {
    title += ".pdf";
  }

  console.log("Saving PDF...");

  await pdf.save(title, {
    returnPromise: true,
  });

  console.log("PDF downloaded successfully!");
})();
