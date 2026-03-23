(function () {
  const PROXY_PREFIX = '/service/scramjet/';
  const SCRAMJET_FILES = {
    wasm: '/service/scramjet/scramjet.wasm.wasm',
    all: '/service/scramjet/scramjet.all.js',
    sync: '/service/scramjet/scramjet.sync.js',
  };

  let controllerPromise;
  const DEFAULT_LAUNCH = 'current';

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
      const proxiedUrl = await buildUrl(destination);
      launchWithMode(proxiedUrl);
      return { ok: true, destination, launchType: getLaunchType() };
    } catch (error) {
      window.location.href = toPrefixedUrl(destination);
      return { ok: true, destination, fallback: true, error };
    }
  };

  const getLaunchType = () => {
    const mode = localStorage.getItem('launchType');
    return mode === 'aboutBlank' || mode === 'blob' ? mode : DEFAULT_LAUNCH;
  };

  const launchWithMode = (proxiedUrl) => {
    const launchType = getLaunchType();
    if (launchType === 'aboutBlank') {
      const win = window.open('about:blank', '_blank');
      if (win && win.document) {
        const iframe = win.document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.inset = '0';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.src = proxiedUrl;
        win.document.body.style.margin = '0';
        win.document.body.style.overflow = 'hidden';
        win.document.body.appendChild(iframe);
        return;
      }
    }

    if (launchType === 'blob') {
      const html = `<!doctype html><html><head><title>Space</title><style>html,body,iframe{margin:0;width:100%;height:100%;border:0;overflow:hidden;background:#000}</style></head><body><iframe src="${proxiedUrl}"></iframe></body></html>`;
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const win = window.open(url, '_blank');
      if (win) return;
    }

    window.location.href = proxiedUrl;
  };

  const buildUrl = async (rawValue) => {
    const destination = normalizeInput(rawValue);
    if (!destination) return '';
    const controller = await ensureController();
    const encodedUrl = typeof controller?.encodeUrl === 'function'
      ? controller.encodeUrl(destination)
      : null;
    return toPrefixedUrl(destination, encodedUrl);
  };

  window.AesirScramjet = {
    normalizeInput,
    buildUrl,
    getLaunchType,
    launchWithMode,
    open,
    toPrefixedUrl,
  };
})();
