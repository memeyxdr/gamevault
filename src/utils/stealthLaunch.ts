/**
 * Opens any game link inside an about:blank tab or cloaked blob window.
 * Many school filter extensions cannot inspect or log URLs opened inside about:blank,
 * helping links avoid getting blocked or tracked in history.
 */
export function openInAboutBlank(url: string, title?: string): void {
  const pageTitle = title || 'Classes';

  // Strategy 1: Try about:blank window with full-viewport iframe
  try {
    const win = window.open('about:blank', '_blank');
    if (win && win.document) {
      win.document.title = pageTitle;

      // Neutral favicon disguise
      const link = win.document.createElement('link');
      link.rel = 'icon';
      link.href = 'https://www.google.com/favicon.ico';
      win.document.head.appendChild(link);

      const iframe = win.document.createElement('iframe');
      iframe.src = url;
      iframe.style.width = '100vw';
      iframe.style.height = '100vh';
      iframe.style.border = 'none';
      iframe.style.position = 'fixed';
      iframe.style.top = '0';
      iframe.style.left = '0';
      iframe.style.margin = '0';
      iframe.style.padding = '0';
      iframe.allow =
        'fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';

      win.document.body.style.margin = '0';
      win.document.body.style.padding = '0';
      win.document.body.style.overflow = 'hidden';
      win.document.body.appendChild(iframe);
      return;
    }
  } catch {
    // If about:blank window.open is restricted, proceed to cloaked blob window
  }

  // Strategy 2: Cloaked Blob window (works reliably in sandboxed contexts)
  try {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${pageTitle}</title>
  <link rel="icon" href="https://www.google.com/favicon.ico">
  <style>
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #000;
    }
    iframe {
      width: 100vw;
      height: 100vh;
      border: none;
      display: block;
    }
  </style>
</head>
<body>
  <iframe src="${url}" allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const blobUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = blobUrl;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);

    setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
    return;
  } catch {
    // Direct link fallback
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.target = '_blank';
    anchor.rel = 'noopener noreferrer';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }
}
