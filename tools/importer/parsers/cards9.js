/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to create a link for a video if needed
  function createVideoLink(videoEl) {
    // Try to get a usable video source (prefer mp4, fallback to webm)
    let src = '';
    const sources = videoEl.querySelectorAll('source');
    for (const s of sources) {
      if (s.type === 'video/mp4' && s.getAttribute('data-landscape')) {
        src = s.getAttribute('data-landscape');
        break;
      }
      if (s.type === 'video/webm' && s.getAttribute('data-landscape')) {
        src = s.getAttribute('data-landscape');
      }
    }
    // fallback to poster if no source
    if (!src && videoEl.poster) {
      src = videoEl.poster;
    }
    if (src) {
      const a = document.createElement('a');
      a.href = src;
      a.textContent = 'Video';
      a.target = '_blank';
      return a;
    }
    return null;
  }

  // Find all immediate GridItem children
  const gridItems = element.querySelectorAll(':scope .GridItem');

  const rows = [];
  // Header row as required
  const headerRow = ['Cards (cards9)'];
  rows.push(headerRow);

  gridItems.forEach((item) => {
    // First cell: media (video as link)
    let mediaCell = null;
    const video = item.querySelector('video');
    if (video) {
      mediaCell = createVideoLink(video);
    }
    // Defensive: fallback to the InlineMedia block if no video
    if (!mediaCell) {
      const inlineMedia = item.querySelector('.InlineMedia');
      if (inlineMedia) {
        mediaCell = inlineMedia;
      }
    }

    // Second cell: text content (title + description)
    let textCell = null;
    const bodyText = item.querySelector('.Theme-Layer-BodyText--inner');
    if (bodyText) {
      textCell = bodyText;
    } else {
      // fallback: try to grab InnerText
      const innerText = item.querySelector('.InnerText');
      if (innerText) {
        textCell = innerText;
      }
    }

    // Defensive: if either cell is missing, skip this card
    if (mediaCell && textCell) {
      rows.push([mediaCell, textCell]);
    }
  });

  // Create the table block
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
