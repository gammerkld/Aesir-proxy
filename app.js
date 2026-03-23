(function () {
  const homeInput = document.getElementById('home-address-input');
  const homeForm = document.getElementById('home-address-form');

  if (homeForm && homeInput) {
    homeForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const destination = window.AesirScramjet?.normalizeInput(homeInput.value) ?? '';
      if (!destination) return;
      const search = new URLSearchParams();
      search.set('url', destination);
      window.location.href = `proxy.html?${search.toString()}`;
    });
  }
})();
