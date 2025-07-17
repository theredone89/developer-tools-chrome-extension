document.addEventListener('DOMContentLoaded', () => {
  const navItems = document.querySelectorAll('.nav-item');
  const contentPanels = document.querySelectorAll('.content-panel');

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();

      // Deactivate current active items
      document.querySelector('.nav-item.active').classList.remove('active');
      document.querySelector('.content-panel.active').classList.remove('active');

      // Activate new items
      item.classList.add('active');
      const targetPanel = document.getElementById(item.dataset.target);
      targetPanel.classList.add('active');
    });
  });

  // Converter logic
  const baseFontSizeInput = document.getElementById('base-font-size');
  const pxInput = document.getElementById('px-input');
  const remInput = document.getElementById('rem-input');
  const pxToRemBtn = document.getElementById('px-to-rem-btn');
  const remToPxBtn = document.getElementById('rem-to-px-btn');

  pxToRemBtn.addEventListener('click', () => {
    const baseSize = parseFloat(baseFontSizeInput.value);
    const pxValue = parseFloat(pxInput.value);
    if (!isNaN(baseSize) && !isNaN(pxValue)) {
      remInput.value = pxValue / baseSize;
    }
  });

  remToPxBtn.addEventListener('click', () => {
    const baseSize = parseFloat(baseFontSizeInput.value);
    const remValue = parseFloat(remInput.value);
    if (!isNaN(baseSize) && !isNaN(remValue)) {
      pxInput.value = remValue * baseSize;
    }
  });

  // Lorem Ipsum Generator Logic
  const generateBtn = document.getElementById('generate-text-btn');
  const paragraphCountInput = document.getElementById('paragraph-count');
  const wordCountInput = document.getElementById('word-count');
  const generateAsListCheckbox = document.getElementById('generate-list');
  const generatedTextInput = document.getElementById('generated-text');
  const copyBtn = document.getElementById('copy-text-btn');
  const copyToast = document.getElementById('copy-toast');
  const listToggleContainer = document.getElementById('list-output-view-toggle');
  const listSwitchInput = document.getElementById('list-view-switch-input');
  const paragraphToggleContainer = document.getElementById('paragraph-output-view-toggle');
  const paragraphSwitchInput = document.getElementById('paragraph-view-switch-input');
  const renderedPreview = document.getElementById('rendered-preview');

  const loremIpsumWords = [
    'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur',
    'adipiscing', 'elit', 'curabitur', 'vel', 'hendrerit', 'libero',
    'eleifend', 'blandit', 'nunc', 'ornare', 'odio', 'ut',
    'orci', 'gravida', 'imperdiet', 'nullam', 'purus', 'lacinia',
    'a', 'pretium', 'quis', 'congue', 'eget', 'praesent', 'sagittis',
    'sodales', 'augue', 'vel', 'suscipit', 'sapien', 'mauris',
    'pede', 'bibendum', 'et', 'commodo', 'vulputate', 'velit',
    'nibh', 'in', 'hac', 'habitasse', 'platea', 'dictumst',
    'maecenas', 'ut', 'massa', 'quis', 'augue', 'luctus',
    'interdum', 'pithiviers'
  ];

  function createLoremIpsum({ paragraphs = 1, wordsPerParagraph, asList = false }) {
    let result = [];
    const avgWordsPerSentence = 12;
    const avgSentencesPerParagraph = 5;

    for (let p = 0; p < paragraphs; p++) {
      let paragraph = '';
      if (wordsPerParagraph && wordsPerParagraph > 0) {
        let words = [];
        for (let i = 0; i < wordsPerParagraph; i++) {
          words.push(loremIpsumWords[Math.floor(Math.random() * loremIpsumWords.length)]);
        }
        paragraph = words.join(' ');
        paragraph = paragraph.charAt(0).toUpperCase() + paragraph.slice(1) + '.';
      } else {
        let sentences = [];
        const sentenceCount = avgSentencesPerParagraph + Math.floor(Math.random() * 3) - 1; // 4-6 sentences
        for (let s = 0; s < sentenceCount; s++) {
          let sentence = [];
          const wordCount = avgWordsPerSentence + Math.floor(Math.random() * 7) - 3; // 9-15 words
          for (let w = 0; w < wordCount; w++) {
            sentence.push(loremIpsumWords[Math.floor(Math.random() * loremIpsumWords.length)]);
          }
          let sentenceStr = sentence.join(' ');
          sentences.push(sentenceStr.charAt(0).toUpperCase() + sentenceStr.slice(1));
        }
        paragraph = sentences.join('. ') + '.';
      }
      result.push(paragraph);
    }

    if (asList) {
      return `<ul>\n${result.map(p => `  <li>${p}</li>`).join('\n')}\n</ul>`; // Use a list
    } else {
      return result.map(p => `<p>${p}</p>`).join('\n\n');
    }
  }

  generateBtn.addEventListener('click', () => {
    const numParagraphs = parseInt(paragraphCountInput.value, 10);
    const numWords = parseInt(wordCountInput.value, 10) || null;
    const asList = generateAsListCheckbox.checked;

    if (isNaN(numParagraphs) || numParagraphs < 1) {
        generatedTextInput.value = "Please enter a valid number of paragraphs.";
        copyBtn.disabled = true;
        return;
    }

    const text = createLoremIpsum({ paragraphs: numParagraphs, wordsPerParagraph: numWords, asList: asList });
    generatedTextInput.value = text;
    renderedPreview.innerHTML = text;
    copyBtn.disabled = !text;

      // Manage list-specific view toggle
      if (asList && text) {
        listToggleContainer.style.display = 'flex';
        paragraphToggleContainer.style.display = 'none';
  
        // Apply current view based on list toggle state
        if (listSwitchInput.checked) {
          generatedTextInput.style.display = 'none';
          renderedPreview.style.display = 'block';
        } else {
          generatedTextInput.style.display = 'block';
          renderedPreview.style.display = 'none';
        }
      } else {
          // Manage paragraph view toggle
          listToggleContainer.style.display = 'none';
          paragraphToggleContainer.style.display = 'flex';

          // Apply current view based on paragraph toggle state
          if (paragraphSwitchInput.checked) {
              generatedTextInput.style.display = 'none';
              renderedPreview.style.display = 'block';
          } else {
              generatedTextInput.style.display = 'block';
              renderedPreview.style.display = 'none';
          }
      }

  
    copyBtn.addEventListener('click', () => {
      if (generatedTextInput.value) {
        navigator.clipboard.writeText(generatedTextInput.value).then(() => {
          copyToast.classList.add('show');
          setTimeout(() => copyToast.classList.remove('show'), 2000);
        }).catch(err => console.error('Failed to copy text: ', err));
      }
    });

    listSwitchInput.addEventListener('change', () => {
      if (listSwitchInput.checked) {
        // Switch to Preview
        generatedTextInput.style.display = 'none';
        renderedPreview.style.display = 'block';
      } else {
        // Switch to Code
        generatedTextInput.style.display = 'block';
        renderedPreview.style.display = 'none';
      }
    });

    paragraphSwitchInput.addEventListener('change', () => {
      if (paragraphSwitchInput.checked) {
        // Switch to Preview
        generatedTextInput.style.display = 'none';
        renderedPreview.style.display = 'block';
      } else {
        // Switch to Code
        generatedTextInput.style.display = 'block';
        renderedPreview.style.display = 'none';
      }
    });


    // Disable copy button initially
    copyBtn.disabled = true;
  });
});