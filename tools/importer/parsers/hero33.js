/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: Get immediate children
  const topDivs = element.querySelectorAll(':scope > div');

  // Find background image (Layer--two)
  let bgImg = null;
  const bgLayer = Array.from(topDivs).find(div => div.classList.contains('Layer--two'));
  if (bgLayer) {
    // Find first <img> inside Layer--two
    const img = bgLayer.querySelector('img[src]');
    if (img) bgImg = img;
  }

  // Find text block (Layer--one)
  let textContent = null;
  const textLayer = Array.from(topDivs).find(div => div.classList.contains('Layer--one'));
  if (textLayer) {
    // Find the deepest text container
    const inner = textLayer.querySelector('.Theme-Layer-TextBlock-Inner');
    if (inner) {
      // We want the main heading and any other content
      // We'll collect all direct children of inner's innermost <div>
      let contentDiv = inner;
      // Go deeper if there is a single child div
      while (contentDiv && contentDiv.children.length === 1 && contentDiv.firstElementChild.tagName === 'DIV') {
        contentDiv = contentDiv.firstElementChild;
      }
      // Now collect all children (h1, figure, etc)
      const contentEls = Array.from(contentDiv.children);
      // Wrap in a div for table cell
      const cellDiv = document.createElement('div');
      contentEls.forEach(el => cellDiv.appendChild(el));
      textContent = cellDiv;
    }
  }

  // Build table rows
  const headerRow = ['Hero (hero33)'];
  const bgRow = [bgImg ? bgImg : ''];
  const textRow = [textContent ? textContent : ''];

  const cells = [headerRow, bgRow, textRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
