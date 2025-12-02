// Background service worker
const EXCHANGE_RATE_API = 'https://api.exchangerate-api.com/v4/latest/';
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

// Cache for exchange rates
let ratesCache = {};

// Initialize default settings
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(['preferredCurrency'], (result) => {
        if (!result.preferredCurrency) {
            chrome.storage.sync.set({ preferredCurrency: 'USD' });
        }
    });
});

// Listen for messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'convertPrice') {
        handleConversion(request.amount, request.fromCurrency)
            .then(result => sendResponse(result))
            .catch(error => sendResponse({ success: false, error: error.message }));
        return true; // Keep message channel open for async response
    }
});

async function handleConversion(amount, fromCurrency) {
    try {
        // Get user's preferred currency
        const settings = await chrome.storage.sync.get(['preferredCurrency']);
        const toCurrency = settings.preferredCurrency || 'USD';

        // If same currency, no conversion needed
        if (fromCurrency === toCurrency) {
            return {
                success: true,
                convertedAmount: amount,
                toCurrency,
                rate: 1
            };
        }

        // Get exchange rate
        const rate = await getExchangeRate(fromCurrency, toCurrency);
        const convertedAmount = amount * rate;

        return {
            success: true,
            convertedAmount,
            toCurrency,
            rate
        };
    } catch (error) {
        console.error('Conversion error:', error);
        return {
            success: false,
            error: error.message || 'Failed to convert currency'
        };
    }
}

async function getExchangeRate(fromCurrency, toCurrency) {
    const cacheKey = `${fromCurrency}_${toCurrency}`;
    const now = Date.now();

    // Check cache
    if (ratesCache[cacheKey] && (now - ratesCache[cacheKey].timestamp < CACHE_DURATION)) {
        return ratesCache[cacheKey].rate;
    }

    // Fetch new rates
    try {
        const response = await fetch(`${EXCHANGE_RATE_API}${fromCurrency}`);
        if (!response.ok) {
            throw new Error('Failed to fetch exchange rates');
        }

        const data = await response.json();
        const rate = data.rates[toCurrency];

        if (!rate) {
            throw new Error(`Exchange rate not found for ${toCurrency}`);
        }

        // Cache the rate
        ratesCache[cacheKey] = {
            rate,
            timestamp: now
        };

        return rate;
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        throw new Error('Unable to fetch exchange rates. Please check your connection.');
    }
}

// Clear old cache entries periodically
setInterval(() => {
    const now = Date.now();
    Object.keys(ratesCache).forEach(key => {
        if (now - ratesCache[key].timestamp > CACHE_DURATION) {
            delete ratesCache[key];
        }
    });
}, CACHE_DURATION);
