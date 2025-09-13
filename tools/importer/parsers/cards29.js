/* global WebImporter */
export default function parse(element, { document }) {
  // Defensive: Find the image in the scrollmation background
  let imageEl = null;
  const bgCol = element.querySelector('.BackgroundScrollmationColumn');
  if (bgCol) {
    // Find the first <img> inside the <picture>
    const pic = bgCol.querySelector('picture');
    if (pic) {
      imageEl = pic.querySelector('img');
    }
  }
  // Defensive: Find the main text content
  let textContentEl = null;
  const layoutCol = element.querySelector('.Layout__col');
  if (layoutCol) {
    const bodyText = layoutCol.querySelector('.Theme-Layer-BodyText--inner');
    if (bodyText) {
      textContentEl = bodyText;
    }
  }
  // Compose the table rows
  const headerRow = ['Cards (cards29)'];
  // Only add the card row if both image and text are present
  const cardRow = [imageEl, textContentEl].filter(Boolean);
  const rows = [headerRow];
  if (cardRow.length === 2) {
    rows.push(cardRow);
  }
  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
