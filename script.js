(async function () {
  console.log("Starting PDF generator...");

  // =========================
  // LOAD JSPDF
  // =========================
  if (!window.jspdf) {
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");

      const scriptURL =
        "https://unpkg.com/jspdf@latest/dist/jspdf.umd.min.js";

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

  // =========================
  // AUTO SCROLL TO LOAD ALL PAGES
  // =========================
  console.log("Loading all pages...");

  let lastHeight = 0;
  let sameCount = 0;

  while (sameCount < 5) {
    window.scrollTo(0, document.body.scrollHeight);

    await new Promise((r) => setTimeout(r, 1500));

    const newHeight = document.body.scrollHeight;

    console.log("Current height:", newHeight);

    if (newHeight === lastHeight) {
      sameCount++;
    } else {
      sameCount = 0;
    }

    lastHeight = newHeight;
  }

  // Return to top
  window.scrollTo(0, 0);

  console.log("All pages should now be loaded.");

  // =========================
  // FIND IMAGES
  // =========================
  let validImgs = [...document.images].filter((img) =>
    img.src.startsWith("blob:https://drive.google.com/")
  );

  // Remove duplicates
  validImgs = [...new Set(validImgs)];

  // Sort by vertical position
  validImgs.sort(
    (a, b) =>
      a.getBoundingClientRect().top -
      b.getBoundingClientRect().top
  );

  console.log(`${validImgs.length} pages found`);

  if (!validImgs.length) {
    console.log("No valid images found.");
    return;
  }

  // =========================
  // CREATE PDF
  // =========================
  let pdf = null;

  const canvas = document.createElement("canvas");

  const ctx = canvas.getContext("2d", {
    alpha: false,
  });

  for (let i = 0; i < validImgs.length; i++) {
    const img = validImgs[i];

    if (!img.naturalWidth || !img.naturalHeight) {
      continue;
    }

    const width = img.naturalWidth;
    const height = img.naturalHeight;

    const orientation =
      width > height ? "landscape" : "portrait";

    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    ctx.drawImage(img, 0, 0, width, height);

    const imgData = canvas.toDataURL(
      "image/jpeg",
      0.95
    );

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

    await new Promise((r) => setTimeout(r, 0));
  }

  // =========================
  // FILE NAME
  // =========================
  let title =
    document.querySelector('meta[itemprop="name"]')
      ?.content?.trim() ||
    document.title?.trim() ||
    "download";

  if (!title.toLowerCase().endsWith(".pdf")) {
    title += ".pdf";
  }

  // =========================
  // SAVE PDF
  // =========================
  console.log("Saving PDF...");

  await pdf.save(title, {
    returnPromise: true,
  });

  console.log("PDF downloaded successfully!");
})();
