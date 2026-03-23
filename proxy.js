(function () {
  const form = document.getElementById('proxy-address-form');
  const input = document.getElementById('proxy-address-input');
  const status = document.getElementById('proxy-status');
  if (!form || !input || !status) return;

  const openInProxy = (rawValue) => {
    const destination = window.AesirScramjet?.normalizeInput(rawValue) ?? '';
    if (!destination) {
      status.textContent = 'Type an address or search term first.';
      return;
    }

    status.textContent = `Opening via Scramjet: ${destination}`;
    window.AesirScramjet?.open(destination);
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    openInProxy(input.value);
  });

  const initialUrl = new URLSearchParams(window.location.search).get('url');
  if (initialUrl) {
    input.value = initialUrl;
    status.textContent = 'Loaded URL from homepage. Press Go to open via Scramjet.';
  }
})();
