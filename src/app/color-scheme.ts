export function syncColorScheme() {
  const query = window.matchMedia('(prefers-color-scheme: dark)');

  const apply = () => {
    const scheme = query.matches ? 'dark' : 'light';
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(scheme);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', query.matches ? '#0d0f14' : '#ffffff');
  };

  apply();
  query.addEventListener('change', apply);
}
