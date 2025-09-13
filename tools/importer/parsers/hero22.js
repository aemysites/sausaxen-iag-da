/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find background image
  function getBackgroundImage() {
    // Find Layer--two (background image container)
    const bgLayer = element.querySelector('.Layer--two');
    if (!bgLayer) return null;
    // Look for <img> inside Layer--two
    const img = bgLayer.querySelector('img');
    if (img) return img;
    // If no <img>, try <picture>
    const picture = bgLayer.querySelector('picture');
    if (picture) return picture;
    return null;
  }

  // Helper to find foreground image/icon
  function getForegroundImage() {
    // Find figure with InlineMedia--image
    const figure = element.querySelector('figure.InlineMedia--image');
    if (!figure) return null;
    const img = figure.querySelector('img');
    if (img) return img;
    return null;
  }

  // Helper to get main text content
  function getTextContent() {
    // Find the main text block container
    const textBlock = element.querySelector('.Theme-Layer-TextBlock-Inner');
    if (!textBlock) return null;
    // We'll collect: icon, heading, paragraph
    const content = [];
    // Icon (number in circle)
    const iconImg = getForegroundImage();
    if (iconImg) content.push(iconImg);
    // Heading
    const heading = textBlock.querySelector('h2');
    if (heading) content.push(heading);
    // Paragraph
    const para = textBlock.querySelector('p');
    if (para) content.push(para);
    return content.length ? content : null;
  }

  // Build table rows
  const headerRow = ['Hero (hero22)'];

  // Background image row
  const bgImg = getBackgroundImage();
  const bgRow = [bgImg ? bgImg : ''];

  // Content row: icon, heading, paragraph
  const textContent = getTextContent();
  const contentRow = [textContent ? textContent : ''];

  // Compose table
  const cells = [
    headerRow,
    bgRow,
    contentRow,
  ];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
