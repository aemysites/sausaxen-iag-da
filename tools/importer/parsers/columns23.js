/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get all immediate column items
  function getColumns(el) {
    // Find the row container
    const rowContainer = el.querySelector('.GridSection__rowContainer');
    if (!rowContainer) return [];
    // Find the row with columns
    const row = rowContainer.querySelector('.GridSection__row');
    if (!row) return [];
    // Get all GridItem columns
    return Array.from(row.querySelectorAll(':scope > .GridItem'));
  }

  // Get the columns
  const columns = getColumns(element);

  // Defensive: if no columns found, do nothing
  if (!columns.length) return;

  // Each column: extract the main content block
  // We'll use the InnerText container for each column
  const cellsRow = columns.map(col => {
    // Find the main content container
    const innerText = col.querySelector('.InnerText');
    // Defensive: fallback to column itself if not found
    return innerText || col;
  });

  // Table header
  const headerRow = ['Columns block (columns23)'];
  // Table rows
  const tableRows = [headerRow, cellsRow];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(tableRows, document);

  // Replace the original element
  element.replaceWith(block);
}
