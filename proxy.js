(function () {
  const PROXY_PREFIX = '/service/scramjet/';

  const form = document.getElementById('proxy-address-form');
  const input = document.getElementById('proxy-address-input');
  const status = document.getElementById('proxy-status');
  if (!form || !input || !status) return;

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

  const openInProxy = (rawValue) => {
    const destination = normalizeInput(rawValue);
    if (!destination) {
      status.textContent = 'Type an address or search term first.';
      return;
    }

    const proxiedUrl = createProxyTarget(destination);
    status.textContent = `Opening via Scramjet: ${destination}`;
    window.location.href = proxiedUrl;
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    openInProxy(input.value);
  });

  const initialUrl = new URLSearchParams(window.location.search).get('url');
  if (initialUrl) {
    input.value = initialUrl;
    openInProxy(initialUrl);
  }
})();
