/* global WebImporter */
export default function parse(element, { document }) {
  // Find columns: left is text, right is image
  const children = Array.from(element.querySelectorAll(':scope > div'));
  let textBlock = null;
  let mediaBlock = null;
  children.forEach((child) => {
    if (child.classList.contains('Theme-Layer-TextBlock')) {
      textBlock = child;
    } else if (child.classList.contains('SplitLayout--media')) {
      mediaBlock = child;
    }
  });
  // Fallbacks if not found
  if (!textBlock && children.length > 0) textBlock = children[0];
  if (!mediaBlock && children.length > 1) mediaBlock = children[1];

  // Column 1: reference the actual text block element
  const textContent = textBlock;
  // Column 2: find the first <img> inside mediaBlock
  let imageContent = null;
  if (mediaBlock) {
    const img = mediaBlock.querySelector('img');
    imageContent = img || mediaBlock;
  }

  // Table header row must match block name exactly
  const headerRow = ['Columns block (columns8)'];
  const contentRow = [textContent, imageContent];
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);

  element.replaceWith(table);
}
