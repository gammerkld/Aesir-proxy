(function () {
  const homeInput = document.getElementById('home-address-input');
  const homeForm = document.getElementById('home-address-form');

  const normalizeInput = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return '';

    const hasScheme = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed);
    if (hasScheme) return trimmed;

    const looksLikeDomain = /^([\w-]+\.)+[\w-]{2,}(\/.*)?$/.test(trimmed);
    if (looksLikeDomain) return `https://${trimmed}`;

    return `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
  };

  if (homeForm && homeInput) {
    homeForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const destination = normalizeInput(homeInput.value);
      if (!destination) return;
      const target = encodeURIComponent(destination);
      window.location.href = `proxy.html?url=${target}`;
    });
  }
})();
