/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: safely find the background image element
  function getBackgroundImageEl() {
    const bgMedia = element.querySelector('.Theme-BackgroundMedia, .Theme-BackgroundImage');
    if (!bgMedia) return null;
    let picture = bgMedia.querySelector('picture');
    if (picture) return picture;
    let img = bgMedia.querySelector('img');
    if (img) return img;
    return null;
  }

  // Helper: extract all text content from Layer--one
  function getTextContentBlock() {
    const textLayer = element.querySelector('.Layer--one');
    if (!textLayer) return '';
    // Collect all headings and paragraphs inside Layer--one
    const blocks = [];
    textLayer.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => {
      if (h.textContent.trim()) {
        blocks.push(h.cloneNode(true));
      }
    });
    textLayer.querySelectorAll('p').forEach(p => {
      if (p.textContent.trim()) {
        blocks.push(p.cloneNode(true));
      }
    });
    textLayer.querySelectorAll('.Theme-Byline').forEach(byline => {
      if (byline.textContent.trim()) {
        blocks.push(byline.cloneNode(true));
      }
    });
    // If nothing found, fallback to all text
    if (blocks.length === 0) {
      const text = textLayer.textContent.trim();
      if (text) blocks.push(text);
    }
    // If still nothing, return empty string
    return blocks.length ? blocks : '';
  }

  // 1. Header row
  const headerRow = ['Hero (hero38)'];

  // 2. Background image row
  const bgImageEl = getBackgroundImageEl();
  const bgImageRow = [bgImageEl ? bgImageEl : ''];

  // 3. Content row (headings, subheading, CTA, etc)
  const contentBlock = getTextContentBlock();
  // Only add the content row if there is actual content
  const cells = [
    headerRow,
    bgImageRow
  ];
  // Always add the third row, but only if there is content
  if (contentBlock && !(Array.isArray(contentBlock) && contentBlock.length === 0)) {
    cells.push([contentBlock]);
  }

  // If there is no content, add an empty row to ensure 3 rows
  if (cells.length < 3) {
    cells.push(['']);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
