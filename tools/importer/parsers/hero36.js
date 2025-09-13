/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get background image from picture/img inside video block
  function getBackgroundImageEl() {
    // Find Layer--two (background media)
    const bgLayer = Array.from(element.children).find(child => child.classList && child.classList.contains('Layer--two'));
    if (!bgLayer) return null;
    // Find <picture> or <img> inside
    const picture = bgLayer.querySelector('picture');
    if (picture) {
      // Use the <img> inside <picture>
      const img = picture.querySelector('img');
      if (img) return img;
    }
    // Fallback: direct <img> under bgLayer
    const img = bgLayer.querySelector('img');
    if (img) return img;
    return null;
  }

  // Helper to get text block (title, subtitle, etc)
  function getTextBlockEl() {
    // Find Layer--one (text block)
    const textLayer = Array.from(element.children).find(child => child.classList && child.classList.contains('Layer--one'));
    if (!textLayer) return null;
    // Find the first Theme-Layer-TextBlock-Inner
    const inner = textLayer.querySelector('.Theme-Layer-TextBlock-Inner');
    if (!inner) return null;
    // The actual text content is inside a <div> within inner
    const contentDiv = inner.querySelector('div');
    if (!contentDiv) return null;
    // Defensive: clone the contentDiv so we don't move it out of context
    // But per instructions, reference the element directly
    return contentDiv;
  }

  // Build table rows
  const headerRow = ['Hero (hero36)'];
  const bgImageEl = getBackgroundImageEl();
  const textBlockEl = getTextBlockEl();

  // Table rows: [header], [background image], [text block]
  const rows = [
    headerRow,
    [bgImageEl ? bgImageEl : ''],
    [textBlockEl ? textBlockEl : ''],
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(rows, document);

  // Replace original element
  element.replaceWith(block);
}
