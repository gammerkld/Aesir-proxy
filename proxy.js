(function () {
  const form = document.getElementById('proxy-address-form');
  const input = document.getElementById('proxy-address-input');
  const status = document.getElementById('proxy-status');
  const frame = document.getElementById('proxy-frame');
  if (!form || !input || !status || !frame) return;
  let statusTimer;

  const setStatus = (message) => {
    clearTimeout(statusTimer);
    if (!message) {
      status.textContent = '';
      status.classList.remove('is-visible');
      return;
    }

    status.textContent = message;
    status.classList.add('is-visible');
    statusTimer = setTimeout(() => {
      status.textContent = '';
      status.classList.remove('is-visible');
    }, 2200);
  };

  const openInProxy = async (rawValue) => {
    const destination = window.AesirScramjet?.normalizeInput(rawValue) ?? '';
    if (!destination) {
      setStatus('Type an address or search term first.');
      return;
    }

    setStatus('Loading...');
    const proxiedUrl = await window.AesirScramjet?.buildUrl(destination);
    if (!proxiedUrl) {
      setStatus('Unable to build Scramjet URL.');
      return;
    }
    frame.src = proxiedUrl;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    await openInProxy(input.value);
  });

  frame.addEventListener('load', () => {
    setStatus('Loaded.');
  });

  const initialUrl = new URLSearchParams(window.location.search).get('url');
  if (initialUrl) {
    input.value = initialUrl;
    openInProxy(initialUrl);
  }
})();
