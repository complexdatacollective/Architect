import fs from 'fs';

export const readFile = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = (event) => {
      resolve(event.target.result);
    };

    reader.onerror = reject;

    reader.readAsDataURL(file);
  });

export const writeFile = (filePath, data) =>
  new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, (error) => {
      if (error) { reject(error); }
      resolve(filePath);
    });
  });
