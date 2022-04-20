# Refresher

Browser extension to auto refresh selected tabs every 10 min.

Tested browser
- Firefox
- Chrome
- Brave

## Install

NOTE: This extension has not been put into any extension store.

### Firefox

Follow doc on [Temporary installation in Firefox](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/)

### Chrome

1. Go to chrome://extensions/
2. Turn on developer mode
3. Load unpacked. Select extension directory.
4. Pin extension.

### Brave

1. Go to brave://extensions/
2. Turn on developer mode
3. Load unpacked. Select extension directory.
4. Pin extension.

## Usage

### Add a tab to auto-refresh

1. Go to the tab.
2. Click the extension icon to indicate you want to auto-refresh. The badge count will increment to reflect the added tab.

### Remove a tab from auto-refresh

1. Go to the tab.
2. Click the extension icon to indicate you no longer need auto-refresh the tab. The badge count will decrement to reflect removed tab.

### Delete a tab with auto-refersh enabled

Badge count will update every 10 min when auto-refresh function runs. During the process, deleted tabs will be cleaned and badge count will update to correct value.
