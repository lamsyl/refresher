const REFRESH_INTERVAL_SEC = 60 * 10;

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
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  return tabs[0];
}

function startRefreshInterval() {
  refreshIntervalId = setInterval(async () => {
    const currentTab = await getCurrentTab();
    for (const tabId of refreshTabIds) {
      if (tabId === currentTab.id) {
        continue;
      }
      browser.tabs.reload(tabId).catch(() => {
        // Invalid tab id. Probably a deleted tab.
        removeTabId(tabId);
      });
    }
  }, REFRESH_INTERVAL_SEC * 1000);
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
