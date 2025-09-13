/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row: must match block name exactly
  const headerRow = ['Hero (hero32)'];

  // 2. Image row: extract image element from <figure>
  let imageCell = '';
  const figure = element.querySelector('figure.InlineMedia--image');
  if (figure) {
    const picture = figure.querySelector('picture');
    if (picture) {
      const img = picture.querySelector('img');
      if (img) {
        imageCell = img;
      }
    }
  }
  const imageRow = [imageCell];

  // 3. Content row: extract heading and subheading
  // Heading: <p class="Theme-TextSize-normal">
  // Subheading: <p class="Theme-TextSize-xxxsmall">
  let headingEl = null;
  let subheadingEl = null;
  const paragraphs = element.querySelectorAll('p');
  paragraphs.forEach((p) => {
    if (p.classList.contains('Theme-TextSize-normal') && !headingEl) {
      headingEl = p;
    } else if (p.classList.contains('Theme-TextSize-xxxsmall') && !subheadingEl) {
      subheadingEl = p;
    }
  });
  // Compose content cell: always preserve semantic HTML
  const contentCell = [];
  if (headingEl) contentCell.push(headingEl);
  if (subheadingEl) contentCell.push(subheadingEl);
  const contentRow = [contentCell];

  // 4. Build the table
  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    imageRow,
    contentRow
  ], document);

  // 5. Replace the original element
  element.replaceWith(table);
}
