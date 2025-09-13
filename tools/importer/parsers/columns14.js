/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as per requirements
  const headerRow = ['Columns block (columns14)'];

  // Find the main GridSection__row (the columns container)
  const row = element.querySelector('.GridSection__row');
  let columns = [];
  if (row) {
    // Get all direct child GridItem elements (each is a column)
    const items = row.querySelectorAll(':scope > .GridItem');
    columns = Array.from(items).map((item) => {
      // For each column, extract the full content of GridItem--inner
      const inner = item.querySelector('.GridItem--inner');
      // Defensive: fallback to item itself if inner not found
      // Return a DocumentFragment containing all child nodes
      const nodes = inner ? Array.from(inner.childNodes) : Array.from(item.childNodes);
      const fragment = document.createDocumentFragment();
      nodes.forEach((n) => fragment.appendChild(n.cloneNode(true)));
      return fragment;
    });
  }

  // Always create the table if we have columns (even if only one)
  if (columns.length > 0) {
    const tableRows = [
      headerRow,
      columns
    ];
    const table = WebImporter.DOMUtils.createTable(tableRows, document);
    element.replaceWith(table);
  }
}
