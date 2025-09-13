/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the first image in the scrollmation block
  function getBackgroundImage(el) {
    const bgScrollmation = el.querySelector('.BackgroundScrollmationColumn');
    if (!bgScrollmation) return null;
    const firstItem = bgScrollmation.querySelector('.BackgroundScrollmationItem');
    if (!firstItem) return null;
    const picture = firstItem.querySelector('picture');
    if (!picture) return null;
    const img = picture.querySelector('img');
    return img || null;
  }

  // Helper to find all text content (title, subtitle, etc)
  function getTextContent(el) {
    const bodyTextInner = el.querySelector('.Theme-Layer-BodyText--inner');
    if (!bodyTextInner) return null;
    // Instead of filtering by children, get all text content inside
    // This will include headings, paragraphs, etc.
    // If there is no meaningful text, return null
    const text = bodyTextInner.textContent.trim();
    if (!text) return '';
    // Clone the node to preserve all structure
    return bodyTextInner.cloneNode(true);
  }

  const headerRow = ['Hero (hero7)'];
  const backgroundImage = getBackgroundImage(element);
  const imageRow = [backgroundImage ? backgroundImage : ''];
  const textContent = getTextContent(element);
  // Always add the third row, even if empty
  const textRow = [textContent ? textContent : ''];
  const cells = [headerRow, imageRow, textRow];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
