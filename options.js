// Options page script
document.addEventListener('DOMContentLoaded', loadSettings);
document.getElementById('save-button').addEventListener('click', saveSettings);

function loadSettings() {
    chrome.storage.sync.get(['preferredCurrency'], (result) => {
        const currency = result.preferredCurrency || 'USD';
        document.getElementById('currency-select').value = currency;
    });
}

function saveSettings() {
    const currency = document.getElementById('currency-select').value;

    chrome.storage.sync.set({ preferredCurrency: currency }, () => {
        showStatus('Settings saved successfully!', 'success');

        // Auto-hide success message after 3 seconds
        setTimeout(() => {
            hideStatus();
        }, 3000);
    });
}

function showStatus(message, type) {
    const statusElement = document.getElementById('status-message');
    statusElement.textContent = message;
    statusElement.className = `status-message ${type}`;
}

function hideStatus() {
    const statusElement = document.getElementById('status-message');
    statusElement.style.display = 'none';
}

// Allow saving with Enter key
document.getElementById('currency-select').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        saveSettings();
    }
});
