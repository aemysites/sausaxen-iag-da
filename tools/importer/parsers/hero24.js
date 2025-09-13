/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the background image
  function getBackgroundImageEl() {
    // Find Layer--two (background image container)
    const bgLayer = Array.from(element.children).find(child => child.classList.contains('Layer--two'));
    if (!bgLayer) return null;
    // Find the first <picture> with a real image src
    const picture = bgLayer.querySelector('picture');
    if (!picture) return null;
    // Find the <img> inside the <picture> with a non-placeholder src
    const img = picture.querySelector('img');
    if (!img) return null;
    // Defensive: ensure it's not a placeholder
    if (img.src && !img.src.startsWith('data:image/gif')) {
      return img;
    }
    // If only placeholder, try to find another <img> in Layer--two
    const imgs = bgLayer.querySelectorAll('img');
    for (const i of imgs) {
      if (i.src && !i.src.startsWith('data:image/gif')) return i;
    }
    return null;
  }

  // Helper to find the text block (title, paragraph)
  function getTextBlockEl() {
    // Find Layer--one (text container)
    const textLayer = Array.from(element.children).find(child => child.classList.contains('Layer--one'));
    if (!textLayer) return null;
    // Find the inner text block container
    const inner = textLayer.querySelector('.Theme-Layer-TextBlock-Inner');
    if (!inner) return textLayer;
    return inner;
  }

  // Build the table rows
  const headerRow = ['Hero (hero24)'];

  // Row 2: background image (optional)
  const bgImgEl = getBackgroundImageEl();
  const bgRow = [bgImgEl ? bgImgEl : ''];

  // Row 3: text block (title, paragraph, etc)
  const textBlockEl = getTextBlockEl();
  const textRow = [textBlockEl ? textBlockEl : ''];

  const cells = [
    headerRow,
    bgRow,
    textRow,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
