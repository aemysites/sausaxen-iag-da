/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Header row
  const headerRow = ['Hero (hero37)'];

  // 2. Background image row
  // Find the <img> inside the <picture> inside the background media layer
  let bgImg = null;
  const bgMediaLayer = element.querySelector('.Theme-BackgroundMedia');
  if (bgMediaLayer) {
    const picture = bgMediaLayer.querySelector('picture');
    if (picture) {
      bgImg = picture.querySelector('img');
    }
  }
  // Defensive: If not found, leave cell empty
  const bgRow = [bgImg ? bgImg : ''];

  // 3. Content row (title, subheading, CTA)
  // Find the text block layer
  let contentCell = document.createElement('div');
  const textBlockLayer = element.querySelector('.Theme-Layer-TextBlock');
  if (textBlockLayer) {
    // Find the main text container (first .Theme-Layer-TextBlock-Container)
    const containers = textBlockLayer.querySelectorAll(':scope > .Theme-Layer-TextBlock-Container');
    if (containers.length > 0) {
      const mainTextInner = containers[0].querySelector('.Theme-Layer-TextBlock-Inner');
      if (mainTextInner) {
        // This inner contains a <div> with <h1> and <p>
        const contentDiv = mainTextInner.querySelector('div');
        if (contentDiv) {
          // Append all children (h1, p, etc) to contentCell
          Array.from(contentDiv.children).forEach(child => {
            contentCell.appendChild(child);
          });
        }
      }
    }
  }
  // Defensive: If nothing found, leave cell empty
  if (!contentCell.hasChildNodes()) {
    contentCell = '';
  }
  const contentRow = [contentCell];

  // 4. Compose table
  const cells = [headerRow, bgRow, contentRow];
  const table = WebImporter.DOMUtils.createTable(cells, document);

  // 5. Replace original element
  element.replaceWith(table);
}
