(function () {
  const form = document.getElementById('proxy-address-form');
  const input = document.getElementById('proxy-address-input');
  const status = document.getElementById('proxy-status');
  if (!form || !input || !status) return;
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
    const result = await window.AesirScramjet?.open(destination);
    if (!result?.ok) {
      setStatus('Unable to build Scramjet URL.');
      return;
    }
    if (result.launchType && result.launchType !== 'current') {
      setStatus(`Opened with ${result.launchType} launch mode.`);
    }
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    await openInProxy(input.value);
  });

  const initialUrl = new URLSearchParams(window.location.search).get('url');
  if (initialUrl) {
    input.value = initialUrl;
    openInProxy(initialUrl);
  }
})();
