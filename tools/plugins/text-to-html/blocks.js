// Block creation functions for AEM Edge Delivery blocks

// Get selected block type from UI
export function getSelectedBlockType() {
  const blockSelect = document.getElementById('da-block-type');
  return blockSelect ? blockSelect.value : 'none';
}

// Create page content with specific block structure
export function createPageWithBlock(htmlContent, blockType) {
  const blockTemplates = {
    'hero': createHeroBlock,
    'cards': createCardsBlock,
    'accordion': createAccordionBlock,
    'quote': createQuoteBlock,
    'table': createTableBlock,
    'tabs': createTabsBlock
  };

  const blockCreator = blockTemplates[blockType];
  if (blockCreator) {
    return blockCreator(htmlContent);
  }

  // Fallback to simple structure
  return createSimplePageStructure(htmlContent);
}

// Simple page structure without blocks
function createSimplePageStructure(content) {
  return `<body>
  <header></header>
  <main>
    <div>
${content}
    </div>
  </main>
</body>`;
}

// Hero Block - Large promotional content block
function createHeroBlock(content) {
  return `<body>
  <header></header>
  <main>
    <div>
      <div class="hero">
        <div>
          <div>
${content}
          </div>
        </div>
      </div>
    </div>
  </main>
</body>`;
}

// Cards Block - Content split into individual card components
function createCardsBlock(content) {
  // Split content into cards based on paragraphs
  const paragraphs = content.split('</p>').filter(p => p.trim());
  const cards = paragraphs.map(p => `        <div>
          <div>${p.replace('<p>', '')}</p></div>
        </div>`).join('\n');

  return `<body>
  <header></header>
  <main>
    <div>
      <div class="cards">
${cards}
      </div>
    </div>
  </main>
</body>`;
}

// Accordion Block - Collapsible content sections
function createAccordionBlock(content) {
  // Split content into accordion items based on paragraphs
  const paragraphs = content.split('</p>').filter(p => p.trim());
  const items = paragraphs.map((p, index) => `        <div>
          <div>Item ${index + 1}</div>
          <div>${p.replace('<p>', '')}</p></div>
        </div>`).join('\n');

  return `<body>
  <header></header>
  <main>
    <div>
      <div class="accordion">
${items}
      </div>
    </div>
  </main>
</body>`;
}

// Quote Block - Styled quotation with attribution
function createQuoteBlock(content) {
  return `<body>
  <header></header>
  <main>
    <div>
      <div class="quote">
        <div>
          <div>${content}</div>
          <div>— Author</div>
        </div>
      </div>
    </div>
  </main>
</body>`;
}

// Table Block - Tabular data presentation
function createTableBlock(content) {
  // Convert content to table rows
  const paragraphs = content.split('</p>').filter(p => p.trim());
  const rows = paragraphs.map(p => `        <div>
          <div>${p.replace('<p>', '')}</p></div>
        </div>`).join('\n');

  return `<body>
  <header></header>
  <main>
    <div>
      <div class="table">
${rows}
      </div>
    </div>
  </main>
</body>`;
}

// Tabs Block - Tabbed content organization
function createTabsBlock(content) {
  // Split content into tabs based on paragraphs
  const paragraphs = content.split('</p>').filter(p => p.trim());
  const tabs = paragraphs.map((p, index) => `        <div>
          <div>Tab ${index + 1}</div>
          <div>${p.replace('<p>', '')}</p></div>
        </div>`).join('\n');

  return `<body>
  <header></header>
  <main>
    <div>
      <div class="tabs">
${tabs}
      </div>
    </div>
  </main>
</body>`;
}
