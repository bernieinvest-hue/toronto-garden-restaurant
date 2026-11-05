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
  let visibleCount = 0;
  menuItems.forEach((item) => {
    item.hidden = category !== 'all' && item.dataset.category !== category;
    if (!item.hidden) visibleCount += 1;
  });
  menuStatus.textContent = `${selectedButton.textContent}: ${visibleCount} items shown.`;
});

document.querySelector('#year').textContent = new Date().getFullYear();
