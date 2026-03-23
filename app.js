(function () {
  const homeInput = document.getElementById('home-address-input');
  const homeForm = document.getElementById('home-address-form');

  if (homeForm && homeInput) {
    homeForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      await window.AesirScramjet?.open(homeInput.value);
    });
  }
})();
