/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the main image in the hero block
  function findHeroImage(el) {
    // Look for the SplitLayout--media container
    const mediaLayer = Array.from(el.children).find(child =>
      child.classList && child.classList.contains('SplitLayout--media')
    );
    if (!mediaLayer) return null;
    // Find the first <img> inside the media layer
    const img = mediaLayer.querySelector('img');
    return img || null;
  }

  // Helper to find the main text block
  function findTextBlock(el) {
    // Look for Layer--one container
    const textLayer = Array.from(el.children).find(child =>
      child.classList && child.classList.contains('Layer--one')
    );
    if (!textLayer) return null;
    // Find the first h1 and p inside the textLayer
    const h1 = textLayer.querySelector('h1');
    const p = textLayer.querySelector('p');
    // Compose a fragment with h1 and p
    const frag = document.createDocumentFragment();
    if (h1) frag.appendChild(h1);
    if (p) frag.appendChild(p);
    return frag.childNodes.length ? frag : null;
  }

  // Compose table rows
  const headerRow = ['Hero (hero35)'];

  // Row 2: Background image
  const heroImg = findHeroImage(element);
  const imageRow = [heroImg ? heroImg : ''];

  // Row 3: Headline, subheading, CTA (if present)
  const textBlock = findTextBlock(element);
  const textRow = [textBlock ? textBlock : ''];

  // Build the table
  const cells = [headerRow, imageRow, textRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the original element
  element.replaceWith(block);
}
