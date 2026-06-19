const tabs = [...document.querySelectorAll('[role="tab"]')];
const panels = [...document.querySelectorAll('[role="tabpanel"]')];
const tabLinks = [...document.querySelectorAll('[data-tab-link]')];
const validTabs = new Set(tabs.map((tab) => tab.dataset.tab));

function activateTab(tabId, options = {}) {
  const { updateHash = true, focusTab = false } = options;
  const safeTabId = validTabs.has(tabId) ? tabId : 'inicio';

  tabs.forEach((tab) => {
    const isActive = tab.dataset.tab === safeTabId;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
    if (isActive && focusTab) tab.focus();
  });

  panels.forEach((panel) => {
    const isActive = panel.id === safeTabId;
    panel.hidden = !isActive;
    panel.classList.toggle('active', isActive);
  });

  if (updateHash && window.location.hash !== `#${safeTabId}`) {
    history.pushState({ tab: safeTabId }, '', `#${safeTabId}`);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(tab.dataset.tab));
  tab.addEventListener('keydown', (event) => {
    let nextIndex;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = tabs.length - 1;
    if (nextIndex === undefined) return;
    event.preventDefault();
    activateTab(tabs[nextIndex].dataset.tab, { focusTab: true });
  });
});

tabLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    activateTab(link.dataset.tabLink);
  });
});

window.addEventListener('popstate', () => {
  activateTab(window.location.hash.slice(1), { updateHash: false });
});

const initialTab = window.location.hash.slice(1);
activateTab(initialTab, { updateHash: false });

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
