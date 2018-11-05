// This prevents user from being able to drop a file anywhere on the app

const initPreventFileDrop = () => {
  document.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
  document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
};

export default initPreventFileDrop;
