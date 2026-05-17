# Download-Any-PDF

Here’s a clean GitHub README for your project:

# Google Drive Blob Image to PDF Downloader

A lightweight browser script that converts Google Drive blob-based page images into a downloadable PDF using `jsPDF`.

Perfect for:

* Notes
* Scanned books
* PDFs rendered as images
* Protected Google Drive previews

---

## Features

* Automatically detects Google Drive blob images
* Preserves original image resolution
* Maintains correct page order
* Supports portrait & landscape pages
* Optimized memory usage
* Uses reusable canvas for performance
* Trusted Types / CSP compatible
* Generates compressed PDFs
* Prevents browser freezing on large documents

---

## How It Works

The script:

1. Detects rendered page images from Google Drive
2. Draws them onto a canvas
3. Converts them into JPEG data
4. Injects them into a PDF using `jsPDF`
5. Downloads the final PDF automatically

---

## Usage

### Step 1

Open the Google Drive document preview.

Example:

* Scanned PDFs
* Image-based documents
* Books/notes preview

---

### Step 2

Scroll through all pages completely so every page image loads.

---

### Step 3

Open browser Developer Tools:

```text
F12 → Console
```

---

### Step 4

Paste the script into the console and press Enter.

---

## Script

```javascript
// Paste full script here
```

---

## Browser Compatibility

Tested on:

* Google Chrome
* Microsoft Edge
* Brave

Requires:

* Modern browser
* Canvas support
* ES6 support

---

## Performance Notes

### Large PDFs

For very large documents (100+ pages):

* Browser memory usage may increase
* Processing may take time
* Keep the tab active

---

### File Size Optimization

Current settings use:

```javascript
canvas.toDataURL("image/jpeg", 0.95)
```

Lower quality for smaller files:

```javascript
canvas.toDataURL("image/jpeg", 0.7)
```

---

## Security / CSP Support

Some websites (including [Google Drive](https://drive.google.com?utm_source=chatgpt.com)) enforce strict Trusted Types CSP policies.

This script includes TrustedScriptURL handling to remain compatible.

---

## Limitations

* Only works after images are fully loaded
* Cannot bypass authentication
* May not work if Google changes preview rendering
* Works only for image-rendered documents

---

## Disclaimer

This project is intended for educational and personal-use purposes only.

Respect copyright laws and content ownership.

---

## License

MIT License

---

## Credits

Built using:

* [jsPDF](https://github.com/parallax/jsPDF?utm_source=chatgpt.com)
