/* global WebImporter */
export default function parse(element, { document }) {
  // Find the video wrapper
  const videoWrapper = element.querySelector('.Theme-Video-Wrapper');
  let videoEl = null;
  let posterImg = null;
  let videoLink = null;
  let textContent = '';

  if (videoWrapper) {
    // Find the <video> element
    videoEl = videoWrapper.querySelector('video');
    if (videoEl) {
      // Try to get poster image from the video element
      const posterUrl = videoEl.getAttribute('poster');
      if (posterUrl) {
        posterImg = document.createElement('img');
        posterImg.src = posterUrl;
        posterImg.alt = '';
      }
      // Try to get a video source URL (prefer mp4, fallback to first source)
      let srcUrl = '';
      const mp4Source = videoEl.querySelector('source[type="video/mp4"]');
      if (mp4Source && mp4Source.getAttribute('data-landscape')) {
        srcUrl = mp4Source.getAttribute('data-landscape');
      } else if (mp4Source && mp4Source.getAttribute('src')) {
        srcUrl = mp4Source.getAttribute('src');
      } else {
        // fallback to first <source>
        const firstSource = videoEl.querySelector('source');
        if (firstSource) {
          srcUrl = firstSource.getAttribute('data-landscape') || firstSource.getAttribute('src') || '';
        }
      }
      if (srcUrl) {
        videoLink = document.createElement('a');
        videoLink.href = srcUrl;
        videoLink.textContent = srcUrl;
      }
    }
  }

  // Extract any text content from the element (for flexibility)
  // This will include any visible text nodes in the block
  textContent = Array.from(element.childNodes)
    .filter(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim())
    .map(n => n.textContent.trim())
    .join(' ');

  // Compose the cell content: poster image (if any), then video link (if any), then text content (if any)
  const cellContent = [];
  if (posterImg) cellContent.push(posterImg);
  if (videoLink) {
    if (cellContent.length > 0) cellContent.push(document.createElement('br'));
    cellContent.push(videoLink);
  }
  if (textContent) {
    if (cellContent.length > 0) cellContent.push(document.createElement('br'));
    cellContent.push(textContent);
  }

  // If no poster or link or text, fallback to the video element itself
  if (cellContent.length === 0 && videoEl) {
    cellContent.push(videoEl);
  }

  // Table rows
  const headerRow = ['Video (video28)'];
  const contentRow = [cellContent.length > 1 ? cellContent : cellContent[0]];
  const table = WebImporter.DOMUtils.createTable([headerRow, contentRow], document);

  // Replace the original element
  element.replaceWith(table);
}
