import fs from 'fs';

export const writeFile = (filePath, data) =>
  new Promise((resolve, reject) => {
    fs.writeFile(filePath, data, (error) => {
      if (error) { reject(error); }
      resolve(filePath);
    });
  });

export const readFile = filePath =>
  new Promise((resolve, reject) => {
    fs.readFile(filePath, (error, data) => {
      if (error) { reject(error); }
      resolve(data);
    });
  });

