function showModal(message) {
  const dialog = document.getElementById("error-dialog");
  const dialogMessage = document.getElementById("dialog-message");

  dialogMessage.textContent = message;

  dialog.showModal();
}

function hideModal() {
  const dialog = document.getElementById("error-dialog");
  dialog.close();
}
