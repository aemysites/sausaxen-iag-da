/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the correct block name for the header
  const headerRow = ['Video (video13)'];

  // Find the video element and its poster
  let videoEl = element.querySelector('video');
  let posterImg;
  let videoLink;
  let textContent = '';

  if (videoEl) {
    // If poster attribute exists, create an img element for it
    const posterUrl = videoEl.getAttribute('poster');
    if (posterUrl) {
      posterImg = document.createElement('img');
      posterImg.src = posterUrl;
      posterImg.alt = '';
    }
    // Find the first <source> with a src
    const sourceEl = videoEl.querySelector('source');
    if (sourceEl && sourceEl.src) {
      videoLink = document.createElement('a');
      videoLink.href = sourceEl.src;
      videoLink.textContent = sourceEl.src;
    }
  }

  // Extract all visible text content from the element, including alt text from images
  function getAllTextContent(node) {
    let text = '';
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent.trim() ? node.textContent + ' ' : '';
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // Include alt text from images
      if (node.tagName.toLowerCase() === 'img' && node.alt) {
        text += node.alt + ' ';
      }
      // Recursively get text from children
      for (const child of node.childNodes) {
        text += getAllTextContent(child);
      }
    }
    return text;
  }
  textContent = getAllTextContent(element).trim();

  // Compose the cell content: poster image (if any), then video link (if any), then text content (if any)
  const cellContent = [];
  if (posterImg) cellContent.push(posterImg);
  if (videoLink) {
    if (cellContent.length > 0) cellContent.push(document.createElement('br'));
    cellContent.push(videoLink);
  }
  if (textContent) {
    if (cellContent.length > 0) cellContent.push(document.createElement('br'));
    cellContent.push(document.createTextNode(textContent));
  }

  // If no video found, fallback to the whole element
  if (cellContent.length === 0) {
    cellContent.push(element);
  }

  const rows = [
    headerRow,
    [cellContent]
  ];

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
