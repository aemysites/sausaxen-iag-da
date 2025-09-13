/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the background image (first <img> inside <picture> in BackgroundScrollmation)
  function getBackgroundImageEl() {
    // Find the BackgroundScrollmationColumn
    const bgCol = element.querySelector('.BackgroundScrollmationColumn');
    if (!bgCol) return null;
    // Find the first picture with an img inside
    const pic = bgCol.querySelector('picture');
    if (!pic) return null;
    const img = pic.querySelector('img');
    return img || null;
  }

  // Helper to get the main text content (title, paragraphs, blockquote)
  function getTextContentEl() {
    // Find the Theme-Layer-BodyText--inner div
    const inner = element.querySelector('.Theme-Layer-BodyText--inner');
    if (!inner) return null;
    // We'll collect the heading, paragraphs, and blockquote
    // Clone to avoid moving nodes if needed
    const frag = document.createDocumentFragment();
    // Heading
    const heading = inner.querySelector('h2');
    if (heading) frag.appendChild(heading);
    // Paragraphs (skip empty ones)
    inner.querySelectorAll('p').forEach(p => {
      if (p.textContent && p.textContent.trim()) {
        frag.appendChild(p);
      }
    });
    // Blockquote (with cite)
    const blockquote = inner.querySelector('blockquote');
    if (blockquote) frag.appendChild(blockquote);
    return frag.childNodes.length ? frag : null;
  }

  // Build the table rows
  const headerRow = ['Hero (hero15)'];

  // Row 2: background image (optional)
  const bgImg = getBackgroundImageEl();
  const bgRow = [bgImg ? bgImg : ''];

  // Row 3: text content (title, paragraphs, blockquote)
  const textContent = getTextContentEl();
  const textRow = [textContent ? Array.from(textContent.childNodes) : ''];

  const cells = [headerRow, bgRow, textRow];

  // Create the block table
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
