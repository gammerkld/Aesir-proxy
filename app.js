(function () {
  const homeInput = document.getElementById('home-address-input');
  const homeForm = document.getElementById('home-address-form');
  const PROXY_PREFIX = '/service/scramjet/';

  const normalizeInput = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return '';

    const hasScheme = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed);
    if (hasScheme) return trimmed;

    const looksLikeDomain = /^([\w-]+\.)+[\w-]{2,}(\/.*)?$/.test(trimmed);
    if (looksLikeDomain) return `https://${trimmed}`;

    return `https://duckduckgo.com/?q=${encodeURIComponent(trimmed)}`;
  };

  const createProxyTarget = (destination) => {
    const encoded = encodeURIComponent(destination);
    return `${PROXY_PREFIX}${encoded}`;
  };

  if (homeForm && homeInput) {
    homeForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const destination = normalizeInput(homeInput.value);
      if (!destination) return;
      window.location.href = createProxyTarget(destination);
    });
  }
})();
