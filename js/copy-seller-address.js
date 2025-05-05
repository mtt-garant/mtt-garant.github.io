function copySellerAddress() {
    const address = document.getElementById('seller-address').textContent;
    navigator.clipboard.writeText(address).then(() => {
      const toast = new bootstrap.Toast(document.getElementById('copy-toast'));
      toast.show();
    }).catch(err => {
      console.error('Copy failed:', err);
    });
  }
