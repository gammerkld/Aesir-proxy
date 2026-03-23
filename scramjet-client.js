(function () {
  const PROXY_PREFIX = '/service/scramjet/';
  const SCRAMJET_FILES = {
    wasm: '/service/scramjet/scramjet.wasm.wasm',
    all: '/service/scramjet/scramjet.all.js',
    sync: '/service/scramjet/scramjet.sync.js',
  };

  let controllerPromise;

  const normalizeInput = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return '';

    const hasScheme = /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed);
    if (hasScheme) return trimmed;

    const looksLikeDomain = /^([\w-]+\.)+[\w-]{2,}(\/.*)?$/.test(trimmed);
    if (looksLikeDomain) return `https://${trimmed}`;

    return `https://duckduckgo.com/?q=${encodeURIComponent(trimmed)}`;
  };

  const toPrefixedUrl = (destination, encodedUrl) => {
    const encoded = encodedUrl ?? encodeURIComponent(destination);
    return `${PROXY_PREFIX}${encoded}`;
  };

  const ensureServiceWorker = async () => {
    if (!('serviceWorker' in navigator)) return;
    await navigator.serviceWorker.register('/sw.js', { scope: '/' });
  };

  const ensureController = async () => {
    if (controllerPromise) return controllerPromise;

    controllerPromise = (async () => {
      if (typeof window.$scramjetLoadController !== 'function') return null;
      const loaded = window.$scramjetLoadController();
      if (!loaded || typeof loaded.ScramjetController !== 'function') return null;

      const controller = new loaded.ScramjetController({ files: SCRAMJET_FILES });
      controller.init();
      await ensureServiceWorker();
      return controller;
    })();

    return controllerPromise;
  };

  const open = async (rawValue) => {
    const destination = normalizeInput(rawValue);
    if (!destination) return { ok: false, reason: 'empty' };

    try {
      const controller = await ensureController();
      const encodedUrl = typeof controller?.encodeUrl === 'function'
        ? controller.encodeUrl(destination)
        : null;

      window.location.href = toPrefixedUrl(destination, encodedUrl);
      return { ok: true, destination };
    } catch (error) {
      window.location.href = toPrefixedUrl(destination);
      return { ok: true, destination, fallback: true, error };
    }
  };

  window.AesirScramjet = {
    normalizeInput,
    open,
    toPrefixedUrl,
  };
})();
