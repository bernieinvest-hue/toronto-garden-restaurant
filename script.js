// Keep the full navigation and menu available when JavaScript is disabled.
const navToggle = document.querySelector('.nav-toggle');
const navigation = document.querySelector('#main-nav');
const mobileQuery = window.matchMedia('(max-width: 720px)');

function syncNavigation() {
  navToggle.hidden = !mobileQuery.matches;
  navToggle.setAttribute('aria-expanded', 'false');
  navigation.hidden = mobileQuery.matches;
}

navToggle.addEventListener('click', () => {
  const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', String(!isExpanded));
  navigation.hidden = isExpanded;
});

navigation.addEventListener('click', (event) => {
  if (event.target.closest('a') && mobileQuery.matches) {
    navigation.hidden = true;
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && mobileQuery.matches && !navigation.hidden) {
    navigation.hidden = true;
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.focus();
  }
});

mobileQuery.addEventListener('change', syncNavigation);
syncNavigation();

const filters = document.querySelector('.menu-filters');
const menuItems = document.querySelectorAll('.menu-item');
const menuStatus = document.querySelector('#menu-status');
filters.hidden = false;

filters.addEventListener('click', (event) => {
  const selectedButton = event.target.closest('button[data-filter]');
  if (!selectedButton) return;
  const category = selectedButton.dataset.filter;
  filters.querySelectorAll('button').forEach((button) => {
    const selected = button === selectedButton;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  menuItems.forEach((item) => {
    item.hidden = category !== 'all' && item.dataset.category !== category;
  });
  updateMenuStatus();
});

document.querySelector('#year').textContent = new Date().getFullYear();

function updateMenuStatus() {
  const activeFilter = filters.querySelector('[aria-pressed="true"]');
  const visibleCount = Array.from(menuItems).filter((item) => !item.hidden).length;
  menuStatus.textContent = document.documentElement.lang === 'zh-Hans'
    ? `${activeFilter.textContent}：显示 ${visibleCount} 项。`
    : `${activeFilter.textContent}: ${visibleCount} ${visibleCount === 1 ? 'item' : 'items'} shown.`;
}

const languageSwitch = document.querySelector('.language-switch');
const languageButtons = languageSwitch.querySelectorAll('[data-language]');
const translatedText = Array.from(document.querySelectorAll('[data-zh]'), (element) => ({
  element,
  english: element.textContent,
}));
const translatedAttributes = ['aria-label', 'alt', 'content'].flatMap((attribute) =>
  Array.from(document.querySelectorAll(`[data-zh-${attribute}]`), (element) => ({
    element,
    attribute,
    english: element.getAttribute(attribute),
  })),
);

function setLanguage(language) {
  const isChinese = language === 'zh-Hans';
  document.documentElement.lang = language;
  translatedText.forEach(({ element, english }) => {
    element.textContent = isChinese ? element.dataset.zh : english;
  });
  translatedAttributes.forEach(({ element, attribute, english }) => {
    const value = isChinese ? element.getAttribute(`data-zh-${attribute}`) : english;
    element.setAttribute(attribute, value);
  });
  languageButtons.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.language === language));
  });
  if (menuStatus.textContent) updateMenuStatus();
}

languageButtons.forEach((button) => {
  button.addEventListener('click', () => setLanguage(button.dataset.language));
});
languageSwitch.hidden = false;
