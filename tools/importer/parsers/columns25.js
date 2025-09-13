/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get immediate .GridItem children
  const gridItems = Array.from(element.querySelectorAll('.GridSection__row .GridItem'));

  // Defensive: If no grid items found, do nothing
  if (!gridItems.length) return;

  // Build the header row
  const headerRow = ['Columns block (columns25)'];

  // Build the columns row: each cell is the full content of a GridItem
  const columnsRow = gridItems.map((item) => {
    // Find the inner content container
    const inner = item.querySelector('.GridItem--inner');
    // Defensive: fallback to item itself if not found
    return inner || item;
  });

  // Assemble table data
  const cells = [
    headerRow,
    columnsRow,
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element with the block table
  element.replaceWith(block);
}
