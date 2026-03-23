(function () {
  const form = document.getElementById('proxy-address-form');
  const input = document.getElementById('proxy-address-input');
  const status = document.getElementById('proxy-status');
  const frame = document.getElementById('proxy-frame');
  if (!form || !input || !status || !frame) return;

  const openInProxy = async (rawValue) => {
    const destination = window.AesirScramjet?.normalizeInput(rawValue) ?? '';
    if (!destination) {
      status.textContent = 'Type an address or search term first.';
      return;
    }

    status.textContent = `Loading via Scramjet: ${destination}`;
    const proxiedUrl = await window.AesirScramjet?.buildUrl(destination);
    if (!proxiedUrl) {
      status.textContent = 'Unable to build Scramjet URL.';
      return;
    }
    frame.src = proxiedUrl;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    await openInProxy(input.value);
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
