/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: get the main image from the BackgroundScrollmation block
  function getMainImage() {
    // Find the picture element inside the BackgroundScrollmation block
    const bgCol = element.querySelector('.BackgroundScrollmationColumn');
    if (!bgCol) return null;
    const picture = bgCol.querySelector('picture');
    if (!picture) return null;
    // Find the <img> inside the <picture>
    const img = picture.querySelector('img');
    if (!img) return null;
    return img;
  }

  // Helper: get the card text content (title, subtitle, paragraphs)
  function getCardText() {
    // The main text is inside .Theme-Layer-BodyText--inner
    const bodyTextInner = element.querySelector('.Theme-Layer-BodyText--inner');
    if (!bodyTextInner) return null;
    // We'll return the whole inner div for resilience
    return bodyTextInner;
  }

  // Build the table rows
  const headerRow = ['Cards (cards30)'];
  const rows = [headerRow];

  // Only one card in this block
  const img = getMainImage();
  const text = getCardText();
  if (img && text) {
    rows.push([img, text]);
  } else {
    // Defensive: fallback to empty cells if missing
    rows.push([img || '', text || '']);
  }

  // Create and replace
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
