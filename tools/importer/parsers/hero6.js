/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the background image
  function getBackgroundImage() {
    // Look for the Layer--two background image container
    const bgLayer = element.querySelector('.Layer--two');
    if (!bgLayer) return null;
    // Find the first <img> inside a <picture> that is not a placeholder
    const pictures = bgLayer.querySelectorAll('picture');
    for (const pic of pictures) {
      const img = pic.querySelector('img');
      if (img && img.src && !img.src.startsWith('data:image/gif')) {
        return img;
      }
    }
    // Fallback: look for any <img> with a non-placeholder src
    const imgs = bgLayer.querySelectorAll('img');
    for (const img of imgs) {
      if (img.src && !img.src.startsWith('data:image/gif')) {
        return img;
      }
    }
    return null;
  }

  // Helper to get the text block
  function getTextBlock() {
    // Find the Layer--one text block container
    const textLayer = element.querySelector('.Layer--one');
    if (!textLayer) return null;
    // The actual text content is nested inside Theme-Layer-TextBlock-Inner
    const inner = textLayer.querySelector('.Theme-Layer-TextBlock-Inner');
    if (!inner) return textLayer;
    return inner;
  }

  // Compose the table rows
  const headerRow = ['Hero (hero6)'];

  // Row 2: background image (optional)
  const bgImg = getBackgroundImage();
  const bgRow = [bgImg ? bgImg : ''];

  // Row 3: text block (title, subtitle, quote, paragraph)
  const textBlock = getTextBlock();
  const textRow = [textBlock ? textBlock : ''];

  // Build the table
  const cells = [headerRow, bgRow, textRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
