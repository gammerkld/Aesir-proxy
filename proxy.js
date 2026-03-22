(function () {
  const PROXY_PREFIX = '/service/scramjet/';

  const frame = document.getElementById('proxy-frame');
  const form = document.getElementById('proxy-address-form');
  const input = document.getElementById('proxy-address-input');
  const status = document.getElementById('proxy-status');

  const normalizeInput = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return '';

    const hasScheme = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed);
    if (hasScheme) return trimmed;

    const looksLikeDomain = /^([\w-]+\.)+[\w-]{2,}(\/.*)?$/.test(trimmed);
    if (looksLikeDomain) return `https://${trimmed}`;

    return `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
  };

  const createProxyTarget = (destination) => {
    const encoded = encodeURIComponent(destination);
    return `${PROXY_PREFIX}${encoded}`;
  };

  const openInProxy = (rawValue) => {
    const destination = normalizeInput(rawValue);
    if (!destination) {
      status.textContent = 'Type an address or search term first.';
      return;
    }

    const proxiedUrl = createProxyTarget(destination);
    status.textContent = `Loading: ${destination}`;
    frame.src = proxiedUrl;

    const search = new URLSearchParams(window.location.search);
    search.set('url', destination);
    window.history.replaceState({}, '', `${window.location.pathname}?${search.toString()}`);
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    openInProxy(input.value);
  });

  frame.addEventListener('load', () => {
    status.textContent = 'Loaded.';
  });

  const initialUrl = new URLSearchParams(window.location.search).get('url');
  if (initialUrl) {
    input.value = initialUrl;
    openInProxy(initialUrl);
  }
})();
