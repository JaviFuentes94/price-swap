// Popup script
document.addEventListener('DOMContentLoaded', () => {
    loadCurrentSettings();

    document.getElementById('settings-button').addEventListener('click', () => {
        chrome.runtime.openOptionsPage();
    });
});

function loadCurrentSettings() {
    chrome.storage.sync.get(['preferredCurrency'], (result) => {
        const currency = result.preferredCurrency || 'USD';
        const currencyNames = {
            USD: '🇺🇸 US Dollar (USD)',
            EUR: '🇪🇺 Euro (EUR)',
            GBP: '🇬🇧 British Pound (GBP)',
            JPY: '🇯🇵 Japanese Yen (JPY)',
            CHF: '🇨� Swiss Franc (CHF)',
            NOK: '🇳🇴 Norwegian Krone (NOK)',
            SEK: '🇸🇪 Swedish Krona (SEK)',
            DKK: '🇩🇰 Danish Krone (DKK)',
            PLN: '🇵🇱 Polish Zloty (PLN)',
            CZK: '🇨🇿 Czech Koruna (CZK)',
            HUF: '🇭🇺 Hungarian Forint (HUF)',
            RON: '🇷🇴 Romanian Leu (RON)',
            BGN: '🇧🇬 Bulgarian Lev (BGN)',
            HRK: '🇭🇷 Croatian Kuna (HRK)',
            ISK: '🇮🇸 Icelandic Króna (ISK)',
            TRY: '🇹🇷 Turkish Lira (TRY)',
            RUB: '�🇺 Russian Ruble (RUB)',
            UAH: '🇺🇦 Ukrainian Hryvnia (UAH)',
            CAD: '🇨🇦 Canadian Dollar (CAD)',
            AUD: '�� Australian Dollar (AUD)',
            CNY: '🇨🇳 Chinese Yuan (CNY)',
            INR: '🇮🇳 Indian Rupee (INR)',
            MXN: '🇲🇽 Mexican Peso (MXN)'
        };

        document.getElementById('current-currency').textContent = currencyNames[currency] || currency;
    });
}
