/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to extract the images from the carousel background
  function getCarouselImages(bgScrollmation) {
    const items = bgScrollmation.querySelectorAll('.BackgroundScrollmationItem');
    const images = [];
    items.forEach(item => {
      // Find the <img> inside the <picture> inside each item
      const img = item.querySelector('picture img');
      if (img && img.src && !img.src.startsWith('data:')) {
        images.push(img);
      }
    });
    return images;
  }

  // Helper to extract the text content for each slide
  function getSlideTexts(bodyTextCol) {
    // Get all direct children (to preserve order and structure)
    const children = Array.from(bodyTextCol.children);
    // Find heading
    const heading = bodyTextCol.querySelector('h2');
    // Find all paragraphs
    const paragraphs = children.filter(el => el.tagName === 'P');
    // Find the divider
    const dividerIdx = children.findIndex(el => el.classList && el.classList.contains('InlineElement--Divider__container'));
    // Split before and after divider
    let stepBlocks = [];
    let currentStep = 1;
    let currentBlock = [];
    for (let i = 0; i < paragraphs.length; i++) {
      const p = paragraphs[i];
      const strong = p.querySelector('strong');
      if (strong && strong.textContent.trim().startsWith(`STEP ${currentStep}:`)) {
        if (currentBlock.length) {
          stepBlocks.push([...currentBlock]);
          currentBlock = [];
        }
        currentBlock.push(p);
        currentStep++;
      } else if (currentBlock.length) {
        currentBlock.push(p);
      }
    }
    if (currentBlock.length) {
      stepBlocks.push([...currentBlock]);
    }
    // First slide: heading + STEP 1
    let slides = [];
    if (heading && stepBlocks[0]) {
      slides.push([heading, ...stepBlocks[0]]);
    }
    // Next slides: STEP 2, STEP 3, STEP 4
    for (let i = 1; i < stepBlocks.length; i++) {
      slides.push([...stepBlocks[i]]);
    }
    // After divider: quote and author
    if (dividerIdx !== -1) {
      // Find paragraphs after divider
      const afterDivider = children.slice(dividerIdx + 1).filter(el => el.tagName === 'P');
      if (afterDivider.length) {
        slides[slides.length - 1].push(...afterDivider);
      }
    }
    return slides;
  }

  // Find the background scrollmation (images)
  const bgScrollmation = element.querySelector('.BackgroundScrollmationColumn');
  // Find the body text column
  const bodyTextCol = element.querySelector('.Theme-Layer-BodyText--inner');

  // Defensive: If either is missing, do nothing
  if (!bgScrollmation || !bodyTextCol) return;

  // Get images and text blocks
  const images = getCarouselImages(bgScrollmation);
  const slideTexts = getSlideTexts(bodyTextCol);

  // Compose table rows
  const headerRow = ['Carousel (carousel17)'];
  const rows = [headerRow];
  // For each image, pair with corresponding text
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    // Defensive: If no text, leave cell empty
    const textBlock = slideTexts[i] ? slideTexts[i] : [];
    rows.push([
      img,
      textBlock.length === 1 ? textBlock[0] : textBlock
    ]);
  }

  // Create the block table
  const block = WebImporter.DOMUtils.createTable(rows, document);
  // Replace the original element
  element.replaceWith(block);
}
