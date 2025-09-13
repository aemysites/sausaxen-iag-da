/* global WebImporter */
export default function parse(element, { document }) {
  // Find the columns in the section
  const layoutRow = element.querySelector('.Layout__row');
  let columns = [];
  if (layoutRow) {
    const colDivs = layoutRow.querySelectorAll(':scope > .Layout__col');
    colDivs.forEach(col => {
      // Find the main content wrapper inside each column
      const bodyText = col.querySelector('.Theme-Layer-BodyText');
      if (bodyText) {
        const inner = bodyText.querySelector('.Theme-Layer-BodyText--inner');
        columns.push(inner ? inner : bodyText);
      } else {
        columns.push(col);
      }
    });
  }

  // Defensive fallback: If no columns found, use direct children
  if (columns.length === 0) {
    const directCols = element.querySelectorAll(':scope > div');
    directCols.forEach(col => columns.push(col));
  }

  // Table header row: must match block name exactly
  const headerRow = ['Columns block (columns16)'];
  // Table content row: one cell per column, referencing DOM elements
  const contentRow = columns;

  // Build the table
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);

  // Replace the original element with the new table
  element.replaceWith(table);
}
