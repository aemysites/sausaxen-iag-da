/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the background image (row 2)
  function getBackgroundImageEl() {
    // Look for .Theme-BackgroundImage picture or img
    const bgDiv = element.querySelector('.Theme-BackgroundImage');
    if (bgDiv) {
      // Try to find a <picture> or <img> inside
      const pic = bgDiv.querySelector('picture');
      if (pic) return pic;
      const img = bgDiv.querySelector('img');
      if (img) return img;
    }
    return '';
  }

  // Helper to get the main content (row 3)
  function getContentBlock() {
    // We'll collect the logo+heading+cta into a wrapper
    const wrapper = document.createElement('div');

    // Find the logo image (figure)
    const figure = element.querySelector('figure');
    if (figure) wrapper.appendChild(figure);

    // Find the main heading (h1)
    const h1 = element.querySelector('h1');
    if (h1) wrapper.appendChild(h1);

    // Find the CTA/button (a inside .Theme-Byline)
    const byline = element.querySelector('.Theme-Byline');
    if (byline) wrapper.appendChild(byline);

    return wrapper;
  }

  // Build the table rows
  const headerRow = ['Hero (hero34)'];
  const bgImageEl = getBackgroundImageEl();
  const contentBlock = getContentBlock();

  const rows = [
    headerRow,
    [bgImageEl],
    [contentBlock]
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(block);
}
