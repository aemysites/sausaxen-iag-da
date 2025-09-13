/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the background image
  function getBackgroundImage() {
    // Look for .BackgroundScrollmationItem--isActive or first .BackgroundScrollmationItem
    const bgScrollmation = element.querySelector('.BackgroundScrollmation');
    let bgItem = null;
    if (bgScrollmation) {
      bgItem = bgScrollmation.querySelector('.BackgroundScrollmationItem--isActive') || bgScrollmation.querySelector('.BackgroundScrollmationItem');
    }
    if (bgItem) {
      // Look for <img> inside <picture>
      const img = bgItem.querySelector('picture img');
      if (img) return img;
    }
    return null;
  }

  // Helper to find the main text content
  function getTextContent() {
    // Find the main column with text
    const bodyTextLayer = element.querySelector('.Theme-Layer-BodyText--inner');
    if (!bodyTextLayer) return null;
    // Collect heading, paragraphs, blockquote
    const nodes = [];
    // Heading
    const heading = bodyTextLayer.querySelector('h2');
    if (heading) nodes.push(heading);
    // Paragraphs
    bodyTextLayer.querySelectorAll('p').forEach(p => {
      // Avoid empty paragraphs
      if (p.textContent.trim()) nodes.push(p);
    });
    // Blockquote
    const blockquote = bodyTextLayer.querySelector('blockquote');
    if (blockquote) nodes.push(blockquote);
    return nodes.length ? nodes : null;
  }

  // Build table rows
  const headerRow = ['Hero (hero18)'];
  const imageEl = getBackgroundImage();
  const imageRow = [imageEl ? imageEl : ''];
  const textNodes = getTextContent();
  const textRow = [textNodes ? textNodes : ''];

  const cells = [headerRow, imageRow, textRow];

  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
