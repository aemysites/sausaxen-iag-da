/* global WebImporter */
export default function parse(element, { document }) {
  // Always use the correct header row
  const headerRow = ['Hero (hero12)'];

  // --- 1. Background Image Row ---
  // Find the first <img> inside a <picture> with a real src
  let bgImg = null;
  const pictures = element.querySelectorAll('picture');
  for (const pic of pictures) {
    const img = pic.querySelector('img');
    if (img && img.src && !img.src.startsWith('data:')) {
      bgImg = img;
      break;
    }
  }
  // If not found, fallback to any <img> with a non-data src
  if (!bgImg) {
    const imgs = element.querySelectorAll('img');
    for (const img of imgs) {
      if (img.src && !img.src.startsWith('data:')) {
        bgImg = img;
        break;
      }
    }
  }
  const imageRow = [bgImg ? bgImg : ''];

  // --- 2. Content Row ---
  // Find the content: logo, heading, subheading, CTA
  // Instead of looking for a specific div, collect all visible content except <picture> blocks
  const contentElements = [];
  // Get all direct children of the root element
  for (const node of Array.from(element.children)) {
    // Skip <picture> and empty divs
    if (node.tagName.toLowerCase() === 'picture') continue;
    // For divs, get their children (logo, headings, etc)
    if (node.tagName.toLowerCase() === 'div') {
      for (const child of Array.from(node.children)) {
        // Skip <picture> blocks
        if (child.tagName.toLowerCase() === 'picture') continue;
        // Only include if it has visible text or is a logo/image
        if (child.textContent.trim() || child.tagName.toLowerCase() === 'img' || child.tagName.toLowerCase() === 'svg') {
          contentElements.push(child.cloneNode(true));
        }
      }
    } else if (node.textContent.trim() || node.tagName.toLowerCase() === 'img' || node.tagName.toLowerCase() === 'svg') {
      contentElements.push(node.cloneNode(true));
    }
  }
  // If still empty, fallback to all text nodes in the element (as <p>)
  if (contentElements.length === 0) {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
      acceptNode: function(node) {
        if (node.textContent.trim()) return NodeFilter.FILTER_ACCEPT;
        return NodeFilter.FILTER_REJECT;
      }
    });
    let node;
    while ((node = walker.nextNode())) {
      const p = document.createElement('p');
      p.textContent = node.textContent.trim();
      contentElements.push(p);
    }
  }
  const contentRow = [contentElements.length ? contentElements : ''];

  // Compose table
  const cells = [
    headerRow,
    imageRow,
    contentRow,
  ];

  // Create block table
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace element with block table
  element.replaceWith(block);
}
