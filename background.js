const REFRESH_INTERVAL_SEC = 60 * 10;
const SKIP_CURRENT_TAB = false;

const SUPPORTED_BROWSER_API = ["firefox", "chrome"];
let detected_browser_api = "firefox";

if (window.browser == null && window.chrome != null) {
  detected_browser_api = "chrome";
  window.browser = window.chrome;
}

const refreshTabIds = new Set();
let refreshIntervalId = null;

function updateBadgeText() {
  const nRefreshTab = refreshTabIds.size;
  browser.browserAction.setBadgeText({
    text: nRefreshTab === 0 ? "" : nRefreshTab.toString(),
  });
}

function addTabId(tabId) {
  refreshTabIds.add(tabId);
  updateBadgeText();
  if (refreshIntervalId == null && refreshTabIds.size > 0) {
    startRefreshInterval();
  }
}

function removeTabId(tabId) {
  refreshTabIds.delete(tabId);
  updateBadgeText();
  if (refreshIntervalId != null && refreshTabIds.size === 0) {
    stopRefreshInterval();
  }
}

function toggleTabId(tabId) {
  if (!refreshTabIds.has(tabId)) {
    addTabId(tabId);
  } else {
    removeTabId(tabId);
  }
}

async function getCurrentTab() {
  switch (detected_browser_api) {
    case "firefox":
      return await getCurrentTabFirefox();
    case "chrome":
      return await getCurrentTabChrome();
    default:
      throw new Error("Unknown browser API");
  }
}

async function getCurrentTabFirefox() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
}

async function getCurrentTabChrome() {
  return new Promise((resolve, reject) => {
    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve(tabs[0]);
    });
  });
}

function startRefreshInterval() {
  refreshIntervalId = setInterval(async () => {
    const currentTab = await getCurrentTab();
    for (const tabId of refreshTabIds) {
      if (SKIP_CURRENT_TAB && tabId === currentTab.id) {
        continue;
      }
      reloadTab(tabId).catch(() => {
        // Invalid tab id. Probably a deleted tab.
        removeTabId(tabId);
      });
    }
  }, REFRESH_INTERVAL_SEC * 1000);
}

async function reloadTab(tabId) {
  switch (detected_browser_api) {
    case "firefox":
      return await reloadTabFirefox(tabId);
    case "chrome":
      return await reloadTabChrome(tabId);
    default:
      throw new Error("Unknown browser API");
  }
}

async function reloadTabFirefox(tabId) {
  return browser.tabs.reload(tabId);
}

async function reloadTabChrome(tabId) {
  return new Promise((resolve, reject) => {
    browser.tabs.reload(tabId, (data) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      }
      resolve();
    });
  });
}

function stopRefreshInterval() {
  clearInterval(refreshIntervalId);
  refreshIntervalId = null;
}

async function toggleAutoRefresh() {
  const currentTab = await getCurrentTab();
  toggleTabId(currentTab.id);
}

browser.browserAction.onClicked.addListener(toggleAutoRefresh);
