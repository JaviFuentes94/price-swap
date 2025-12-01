// Content script - runs on all web pages
let conversionTooltip = null;
let lastSelection = null;

// Domain to currency mapping for disambiguation
const DOMAIN_CURRENCY_MAP = {
  // Norwegian domains
  '.no': 'NOK',
  'norway': 'NOK',
  'norwegian': 'NOK',
  // Swedish domains
  '.se': 'SEK',
  'sweden': 'SEK',
  'swedish': 'SEK',
  // Danish domains
  '.dk': 'DKK',
  'denmark': 'DKK',
  'danish': 'DKK',
  // Icelandic domains
  '.is': 'ISK',
  'iceland': 'ISK',
  // Croatian domains
  '.hr': 'HRK',
  'croatia': 'HRK',
  'croatian': 'HRK'
};

// Currency symbols and patterns
const CURRENCY_PATTERNS = {
  USD: { symbols: ['$', 'USD', 'US$'], regex: /\$\s*(\d+(?:,\d{3})*(?:\.\d{2})?)|(\d+(?:,\d{3})*(?:\.\d{2})?)\s*USD/i },
  EUR: { symbols: ['€', 'EUR'], regex: /€\s*(\d+(?:,\d{3})*(?:\.\d{2})?)|(\d+(?:,\d{3})*(?:\.\d{2})?)\s*EUR/i },
  GBP: { symbols: ['£', 'GBP'], regex: /£\s*(\d+(?:,\d{3})*(?:\.\d{2})?)|(\d+(?:,\d{3})*(?:\.\d{2})?)\s*GBP/i },
  CHF: { symbols: ['CHF', 'Fr'], regex: /CHF\s*(\d+(?:,\d{3})*(?:\.\d{2})?)|(\d+(?:,\d{3})*(?:\.\d{2})?)\s*CHF/i },
  NOK: { symbols: ['kr', 'NOK'], regex: /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*kr|(\d+(?:,\d{3})*(?:\.\d{2})?)\s*NOK/i },
  SEK: { symbols: ['kr', 'SEK'], regex: /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*kr|(\d+(?:,\d{3})*(?:\.\d{2})?)\s*SEK/i },
  DKK: { symbols: ['kr', 'DKK'], regex: /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*kr|(\d+(?:,\d{3})*(?:\.\d{2})?)\s*DKK/i },
  PLN: { symbols: ['zł', 'PLN'], regex: /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*zł|(\d+(?:,\d{3})*(?:\.\d{2})?)\s*PLN/i },
  CZK: { symbols: ['Kč', 'CZK'], regex: /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*Kč|(\d+(?:,\d{3})*(?:\.\d{2})?)\s*CZK/i },
  HUF: { symbols: ['Ft', 'HUF'], regex: /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*Ft|(\d+(?:,\d{3})*(?:\.\d{2})?)\s*HUF/i },
  RON: { symbols: ['lei', 'RON'], regex: /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*lei|(\d+(?:,\d{3})*(?:\.\d{2})?)\s*RON/i },
  BGN: { symbols: ['лв', 'BGN'], regex: /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*лв|(\d+(?:,\d{3})*(?:\.\d{2})?)\s*BGN/i },
  HRK: { symbols: ['kn', 'HRK'], regex: /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*kn|(\d+(?:,\d{3})*(?:\.\d{2})?)\s*HRK/i },
  ISK: { symbols: ['kr', 'ISK'], regex: /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*ISK/i },
  TRY: { symbols: ['₺', 'TRY'], regex: /₺\s*(\d+(?:,\d{3})*(?:\.\d{2})?)|(\d+(?:,\d{3})*(?:\.\d{2})?)\s*TRY/i },
  RUB: { symbols: ['₽', 'RUB'], regex: /₽\s*(\d+(?:,\d{3})*(?:\.\d{2})?)|(\d+(?:,\d{3})*(?:\.\d{2})?)\s*RUB/i },
  UAH: { symbols: ['₴', 'UAH'], regex: /₴\s*(\d+(?:,\d{3})*(?:\.\d{2})?)|(\d+(?:,\d{3})*(?:\.\d{2})?)\s*UAH/i },
  JPY: { symbols: ['¥', 'JPY'], regex: /¥\s*(\d+(?:,\d{3})*)|(\d+(?:,\d{3})*)\s*JPY/i },
  CAD: { symbols: ['CAD', 'C$', 'CA$'], regex: /C\$\s*(\d+(?:,\d{3})*(?:\.\d{2})?)|(\d+(?:,\d{3})*(?:\.\d{2})?)\s*CAD/i },
  AUD: { symbols: ['AUD', 'A$', 'AU$'], regex: /A\$\s*(\d+(?:,\d{3})*(?:\.\d{2})?)|(\d+(?:,\d{3})*(?:\.\d{2})?)\s*AUD/i },
  CNY: { symbols: ['¥', 'CNY', 'RMB'], regex: /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*CNY|(\d+(?:,\d{3})*(?:\.\d{2})?)\s*RMB/i },
  INR: { symbols: ['₹', 'INR'], regex: /₹\s*(\d+(?:,\d{3})*(?:\.\d{2})?)|(\d+(?:,\d{3})*(?:\.\d{2})?)\s*INR/i },
  MXN: { symbols: ['MXN', 'MX$'], regex: /MX\$\s*(\d+(?:,\d{3})*(?:\.\d{2})?)|(\d+(?:,\d{3})*(?:\.\d{2})?)\s*MXN/i }
};

// Listen for text selection
document.addEventListener('mouseup', handleTextSelection);
document.addEventListener('touchend', handleTextSelection);

// Close tooltip when clicking elsewhere
document.addEventListener('mousedown', (e) => {
  if (conversionTooltip && !conversionTooltip.contains(e.target)) {
    removeTooltip();
  }
});

function handleTextSelection(event) {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();

  // Remove tooltip if no selection
  if (!selectedText) {
    removeTooltip();
    return;
  }

  // Clean the text of zero-width characters and extra whitespace
  const cleanedText = cleanText(selectedText);

  // Check if text contains a price
  const priceInfo = detectPrice(cleanedText);
  
  if (priceInfo) {
    lastSelection = { text: cleanedText, priceInfo, selection };
    showConversionTooltip(priceInfo, event);
  } else {
    removeTooltip();
  }
}

function cleanText(text) {
  // Remove zero-width characters, non-breaking spaces, and normalize whitespace
  return text
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // Zero-width characters
    .replace(/\u00A0/g, ' ') // Non-breaking spaces
    .replace(/\s+/g, ' ') // Multiple spaces to single space
    .trim();
}

function detectPrice(text) {
  const url = window.location.hostname.toLowerCase();
  const ambiguousCurrencies = ['NOK', 'SEK', 'DKK', 'ISK', 'HRK'];
  let detectedCurrency = null;
  let detectedAmount = null;
  let detectedText = text;
  
  // Try to match each currency pattern
  for (const [currency, pattern] of Object.entries(CURRENCY_PATTERNS)) {
    const match = text.match(pattern.regex);
    if (match) {
      // Extract the numeric value
      const numericValue = (match[1] || match[2]).replace(/,/g, '');
      const amount = parseFloat(numericValue);
      
      if (!isNaN(amount) && amount > 0) {
        // Check if the selection is ONLY the price (not extra text)
        // Remove the matched price from the text and check if anything substantial remains
        const textWithoutPrice = text.replace(match[0], '').trim();
        const hasExtraText = textWithoutPrice.length > 0 && /[a-zA-Z]{2,}/.test(textWithoutPrice);
        
        if (hasExtraText) {
          // Selection contains more than just the price
          continue;
        }
        
        // If this is an ambiguous currency (kr), use domain to disambiguate
        if (ambiguousCurrencies.includes(currency) && text.match(/\bkr\b/i)) {
          // Check if we already found a more specific currency
          if (!detectedCurrency) {
            detectedCurrency = currency;
            detectedAmount = amount;
          }
          // Use domain heuristics to determine correct currency
          for (const [domain, domainCurrency] of Object.entries(DOMAIN_CURRENCY_MAP)) {
            if (url.includes(domain)) {
              return {
                amount,
                currency: domainCurrency,
                originalText: match[0].trim()
              };
            }
          }
        } else {
          // Non-ambiguous currency or specific code like NOK, SEK
          return {
            amount,
            currency,
            originalText: match[0].trim()
          };
        }
      }
    }
  }
  
  // Return detected ambiguous currency if found
  if (detectedCurrency) {
    return {
      amount: detectedAmount,
      currency: detectedCurrency,
      originalText: detectedText
    };
  }
  
  return null;
}

function showConversionTooltip(priceInfo, event) {
  removeTooltip();

  // Create tooltip element
  conversionTooltip = document.createElement('div');
  conversionTooltip.className = 'price-swap-tooltip';
  conversionTooltip.innerHTML = `
    <div class="price-swap-loading">
      <div class="price-swap-spinner"></div>
      <span>Converting...</span>
    </div>
  `;

  document.body.appendChild(conversionTooltip);

  // Position tooltip near the selection
  positionTooltip(event);

  // Request conversion
  convertPrice(priceInfo);
}

function positionTooltip(event) {
  if (!conversionTooltip) return;

  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    const tooltipHeight = 80; // Approximate height
    const tooltipWidth = 250;
    
    let top = rect.bottom + window.scrollY + 10;
    let left = rect.left + window.scrollX + (rect.width / 2) - (tooltipWidth / 2);
    
    // Adjust if tooltip goes off screen
    if (left < 10) left = 10;
    if (left + tooltipWidth > window.innerWidth - 10) {
      left = window.innerWidth - tooltipWidth - 10;
    }
    
    // If tooltip would be below viewport, show above selection
    if (rect.bottom + tooltipHeight > window.innerHeight) {
      top = rect.top + window.scrollY - tooltipHeight - 10;
    }
    
    conversionTooltip.style.top = `${top}px`;
    conversionTooltip.style.left = `${left}px`;
  }
}

function convertPrice(priceInfo) {
  // Send message to background script to convert
  chrome.runtime.sendMessage({
    action: 'convertPrice',
    amount: priceInfo.amount,
    fromCurrency: priceInfo.currency
  }, (response) => {
    if (response && response.success) {
      displayConversion(priceInfo, response.convertedAmount, response.toCurrency, response.rate);
    } else {
      displayError(response?.error || 'Conversion failed');
    }
  });
}

function displayConversion(priceInfo, convertedAmount, toCurrency, rate) {
  if (!conversionTooltip) return;

  const currencySymbols = {
    USD: '$', EUR: '€', GBP: '£', CHF: 'CHF',
    NOK: 'kr', SEK: 'kr', DKK: 'kr', PLN: 'zł',
    CZK: 'Kč', HUF: 'Ft', RON: 'lei', BGN: 'лв',
    HRK: 'kn', ISK: 'kr', TRY: '₺', RUB: '₽', UAH: '₴',
    JPY: '¥', CAD: 'CA$', AUD: 'AU$', CNY: '¥', INR: '₹', MXN: 'MX$'
  };

  const toSymbol = currencySymbols[toCurrency] || toCurrency;
  const fromSymbol = currencySymbols[priceInfo.currency] || priceInfo.currency;
  
  const formattedAmount = convertedAmount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  conversionTooltip.innerHTML = `
    <div class="price-swap-content">
      <div class="price-swap-original">
        ${priceInfo.originalText} (${priceInfo.currency})
      </div>
      <div class="price-swap-arrow">→</div>
      <div class="price-swap-converted">
        ${toSymbol}${formattedAmount} ${toCurrency}
      </div>
      <div class="price-swap-rate">
        1 ${priceInfo.currency} = ${rate.toFixed(4)} ${toCurrency}
      </div>
    </div>
  `;
}

function displayError(error) {
  if (!conversionTooltip) return;

  conversionTooltip.innerHTML = `
    <div class="price-swap-content price-swap-error">
      <div class="price-swap-error-icon">⚠️</div>
      <div class="price-swap-error-text">${error}</div>
    </div>
  `;
}

function removeTooltip() {
  if (conversionTooltip) {
    conversionTooltip.remove();
    conversionTooltip = null;
  }
}

// Handle window scroll/resize
let scrollTimeout;
window.addEventListener('scroll', () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    removeTooltip();
  }, 100);
}, true);

window.addEventListener('resize', removeTooltip);
