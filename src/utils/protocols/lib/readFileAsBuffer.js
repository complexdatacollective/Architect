const readFileAsBuffer = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();

  reader.onloadend = (event) => {
    resolve(Buffer.from(event.target.result));
  };

  reader.onerror = reject;
  reader.onabort = reject;

  reader.readAsArrayBuffer(file);
});

export default readFileAsBuffer;
