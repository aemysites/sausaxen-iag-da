/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate children by class
  function getChildByClass(parent, className) {
    return Array.from(parent.children).find(child => child.classList.contains(className));
  }

  // Get the two main columns
  const layout = element.querySelector('.Layout');
  if (!layout) return;
  const row = layout.querySelector('.Layout__row');
  if (!row) return;
  const cols = row.querySelectorAll(':scope > .Layout__col');
  if (cols.length < 2) return;

  // Left column: text and icons
  const leftCol = cols[0];
  // Right column: images
  const rightCol = cols[1];

  // --- LEFT COLUMN ---
  // The left column contains a single inner div with all content
  const leftContent = getChildByClass(leftCol, 'Theme-Layer-BodyText');
  // Defensive: fallback to the column itself if not found
  const leftCellContent = leftContent || leftCol;

  // --- RIGHT COLUMN ---
  // The right column contains a sticky card canvas with three images
  const cardCanvas = rightCol.querySelector('.Theme-Layer-CardCanvas');
  // Defensive: fallback to the column itself if not found
  const rightCellContent = cardCanvas || rightCol;

  // Table header
  const headerRow = ['Columns block (columns11)'];
  // Table content row: left and right columns
  const contentRow = [leftCellContent, rightCellContent];

  // Build table
  const cells = [headerRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // Replace original element
  element.replaceWith(table);
}
