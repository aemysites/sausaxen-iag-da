/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the background image
  function getBackgroundImage() {
    // Look for a picture tag inside Layer--two
    const bgLayer = Array.from(element.querySelectorAll(':scope > div')).find(div => div.classList.contains('Layer--two'));
    if (!bgLayer) return '';
    // Find the <picture> element
    const picture = bgLayer.querySelector('picture');
    if (picture) {
      // Find the <img> inside picture
      const img = picture.querySelector('img');
      if (img) return img;
    }
    return '';
  }

  // Helper to find the text content
  function getTextContent() {
    // Find Layer--one
    const textLayer = Array.from(element.querySelectorAll(':scope > div')).find(div => div.classList.contains('Layer--one'));
    if (!textLayer) return '';
    // Find the inner text block
    const inner = textLayer.querySelector('.Theme-Layer-TextBlock-Inner');
    if (!inner) return '';
    // The direct child <div> contains headings and paragraph
    const contentDiv = inner.querySelector('div');
    if (!contentDiv) return '';
    // We'll collect all children (h2, h4, etc.)
    const children = Array.from(contentDiv.children);
    // Defensive: filter out only heading and paragraph tags
    const validTags = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P'];
    const content = children.filter(el => validTags.includes(el.tagName));
    // If nothing found, fallback to all children
    return content.length ? content : children;
  }

  // Build the table rows
  const headerRow = ['Hero (hero31)'];

  // Row 2: background image (optional)
  const bgImg = getBackgroundImage();
  const imageRow = [bgImg ? bgImg : ''];

  // Row 3: text content (title, subheading, etc.)
  const textContent = getTextContent();
  const textRow = [textContent && textContent.length ? textContent : ''];

  // Compose the table
  const cells = [
    headerRow,
    imageRow,
    textRow,
  ];

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
