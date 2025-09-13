/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to find the background image (from <video> fallback <picture> or <img>)
  function getBackgroundImageEl() {
    // Find the background media container
    const bgMedia = element.querySelector('.Theme-BackgroundMedia');
    if (!bgMedia) return null;
    // Try to find a fallback <picture> with an <img>
    let img = bgMedia.querySelector('picture img[src]:not([src^="data:"])');
    if (img) return img;
    // Fallback: try to find a <video> with poster or src
    const video = bgMedia.querySelector('video[src]');
    if (video && video.getAttribute('poster')) {
      const posterImg = document.createElement('img');
      posterImg.src = video.getAttribute('poster');
      return posterImg;
    }
    return null;
  }

  // Helper to get the main text content (title, subtitle, cta)
  function getTextContentEl() {
    // The main text block is the first .Theme-Layer-TextBlock-Container
    const containers = element.querySelectorAll('.Theme-Layer-TextBlock-Container');
    if (!containers.length) return null;
    // We'll combine both containers (title/desc and CTA)
    const wrapper = document.createElement('div');
    containers.forEach((c) => {
      // Only append if not empty
      if (c && c.textContent.trim()) wrapper.appendChild(c);
    });
    return wrapper.childNodes.length ? wrapper : null;
  }

  // Build the table rows
  const headerRow = ['Hero (hero39)'];

  // Row 2: background image (optional)
  const bgImgEl = getBackgroundImageEl();
  const bgRow = [bgImgEl ? bgImgEl : ''];

  // Row 3: text content (title, subtitle, cta)
  const textContentEl = getTextContentEl();
  const textRow = [textContentEl ? textContentEl : ''];

  const cells = [headerRow, bgRow, textRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
