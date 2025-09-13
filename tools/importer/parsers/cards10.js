/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image and text from a GridItem
  function extractCardContent(gridItem) {
    // Find the figure containing the image
    const figure = gridItem.querySelector('figure');
    let imageEl = null;
    if (figure) {
      const picture = figure.querySelector('picture');
      if (picture) {
        imageEl = picture;
      }
    }
    // Extract the title from the alt attribute of the image
    let titleText = '';
    if (figure) {
      const img = figure.querySelector('img[alt]');
      if (img && img.getAttribute('alt')) {
        titleText = img.getAttribute('alt');
      }
    }
    // Compose text cell: always include the title as heading (not empty)
    const textCell = document.createElement('div');
    const heading = document.createElement('strong');
    heading.textContent = titleText;
    textCell.appendChild(heading);
    return [imageEl, textCell];
  }

  // Find all GridItem elements in the block
  const gridItems = element.querySelectorAll('.GridItem');
  const rows = [];
  // Header row
  rows.push(['Cards (cards10)']);
  // Each card row: [image, text]
  gridItems.forEach((gridItem) => {
    const [image, text] = extractCardContent(gridItem);
    rows.push([image, text]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
