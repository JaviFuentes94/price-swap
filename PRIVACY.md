# Privacy Policy for Price Swap

**Last Updated: December 1, 2025**

## Overview

Price Swap is committed to protecting your privacy. This extension does **NOT** collect, store, or transmit any personal data or browsing information.

## Data Collection

**We do not collect any user data.** Period.

## What We Store Locally

The following data is stored **only on your device** using Chrome's local storage:

- **Preferred Currency Selection**: Your chosen currency (e.g., USD, EUR, GBP) is saved locally so the extension remembers your preference
- **Cached Exchange Rates**: Current exchange rates are temporarily cached for up to 1 hour to improve performance and reduce API calls

This data:
- Never leaves your device
- Is not transmitted to any servers (except the exchange rate API as described below)
- Can be cleared by removing the extension or clearing Chrome's extension data

## What We Access

Price Swap only accesses:

1. **Text You Select**: When you manually highlight text on a webpage, the extension checks if it contains a price
2. **Current Webpage Domain**: Used to intelligently detect which currency is being used (e.g., .no domains likely use Norwegian Krone)
3. **Exchange Rate API**: Makes anonymous requests to fetch current currency conversion rates

## What We Don't Do

- ❌ We do **NOT** track your browsing history
- ❌ We do **NOT** collect personal information
- ❌ We do **NOT** share data with third parties
- ❌ We do **NOT** use analytics or tracking tools
- ❌ We do **NOT** monitor or access content you haven't explicitly selected
- ❌ We do **NOT** read passwords, form data, or sensitive information
- ❌ We do **NOT** inject ads or modify webpage content

## External Services

### Exchange Rate API

The extension makes anonymous API requests to `api.exchangerate-api.com` to fetch current currency exchange rates. These requests:

- Contain no personal information
- Contain no browsing history
- Contain no user identifiers
- Only request current exchange rate data
- Are cached locally for 1 hour to minimize API calls

## Permissions Explained

### Storage Permission
Used to save your preferred currency and cache exchange rates locally on your device.

### Host Permission (api.exchangerate-api.com)
Used to fetch current exchange rates for accurate currency conversion.

### Content Scripts
The extension uses content scripts that run on webpages to detect when you manually select text containing prices. These scripts only activate when you select text and only process the selected text to check for price information.

## Your Rights

You have complete control over your data:

- All preferences are stored locally on your device
- You can change your preferred currency at any time
- You can remove the extension to delete all stored data
- No account or registration is required

## Children's Privacy

Price Swap does not knowingly collect any information from children. The extension does not collect data from users of any age.

## Changes to Privacy Policy

Any updates to this privacy policy will be:
- Posted in this document
- Reflected in the Chrome Web Store listing
- Announced in the extension's GitHub repository

## Third-Party Services

The only third-party service used is:
- **ExchangeRate-API** (exchangerate-api.com) - for fetching currency conversion rates

We do not control the privacy practices of this service. Please review their privacy policy at their website.

## Contact

For privacy questions, concerns, or requests:

- **GitHub Issues**: https://github.com/JaviFuentes94/price-swap/issues
- **GitHub Discussions**: https://github.com/JaviFuentes94/price-swap/discussions
- **Email**: [Contact through GitHub profile]

## Open Source

Price Swap is open source. You can review the complete source code at:
https://github.com/JaviFuentes94/price-swap

## Compliance

This extension complies with:
- Chrome Web Store Developer Program Policies
- General Data Protection Regulation (GDPR)
- California Consumer Privacy Act (CCPA)

## Summary

**In short**: Price Swap respects your privacy. We don't collect your data, we don't track you, and we don't share anything with third parties. Your currency preference stays on your device, and we only fetch exchange rates to do the conversion.

---

*This privacy policy is effective as of December 1, 2025.*
