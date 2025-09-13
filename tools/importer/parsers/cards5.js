/* global WebImporter */
export default function parse(element, { document }) {
  // Find all GridItem elements in all rows
  const gridItems = element.querySelectorAll('.GridItem');
  if (!gridItems.length) return;

  // Table header row
  const headerRow = ['Cards (cards5)'];
  const rows = [headerRow];

  gridItems.forEach((gridItem) => {
    // Find image (first cell)
    let imageEl = null;
    const mediaLeft = gridItem.querySelector('.GridItem--media-left');
    if (mediaLeft) {
      const inlineMedia = mediaLeft.querySelector('.InlineMedia');
      if (inlineMedia) {
        const picture = inlineMedia.querySelector('picture');
        if (picture) {
          imageEl = picture;
        } else {
          const img = inlineMedia.querySelector('img');
          if (img) imageEl = img;
        }
      }
    }

    // Find text content (second cell)
    let textCellContent = [];
    // Get all children of .InnerText (should include heading, description, CTA)
    const innerText = gridItem.querySelector('.InnerText');
    if (innerText) {
      // Push all direct children of .InnerText (usually a div)
      Array.from(innerText.children).forEach((child) => {
        textCellContent.push(child);
      });
    }

    // Defensive: Only add row if image and text exist
    if (imageEl && textCellContent.length) {
      rows.push([imageEl, textCellContent]);
    }
  });

  // Create block table and replace element
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
