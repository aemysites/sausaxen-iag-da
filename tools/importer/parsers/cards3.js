/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract image from card
  function getImage(gridItem) {
    // Find the <img> inside the card
    const img = gridItem.querySelector('img');
    return img || null;
  }

  // Helper to extract text content from card
  function getText(gridItem) {
    // Find the text container
    const textContainer = gridItem.querySelector('.InnerText, .Theme-Layer-BodyText');
    if (!textContainer) return '';
    // Use the inner text block
    const inner = textContainer.querySelector('.Theme-Layer-BodyText--inner') || textContainer;
    // Defensive: If inner is empty, fallback to textContainer
    return inner.childNodes.length ? inner : textContainer;
  }

  // Find all card items
  const gridSection = element.querySelector('.GridSection');
  if (!gridSection) return;
  const gridItems = gridSection.querySelectorAll('.GridItem');

  // Build table rows
  const headerRow = ['Cards (cards3)'];
  const rows = [headerRow];

  gridItems.forEach((gridItem) => {
    // First cell: image
    const image = getImage(gridItem);
    // Second cell: text content
    const text = getText(gridItem);
    rows.push([
      image ? image : '',
      text ? text : '',
    ]);
  });

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace the original element
  element.replaceWith(block);
}
