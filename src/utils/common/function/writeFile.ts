import { BadRequestException } from '@nestjs/common';
import * as fs from 'fs';

export const createFile = (message: string) => {
  fs.writeFile('./uploads/YUIK_CREDENTIALS.txt', message, function (err) {
    if (err) throw err;
    console.log('File is created successfully.');
  });
};

export const jsonToSnapshotFile = (jsonDoc: string, fileName: string) => {
  const filePath = `./upload/${fileName}`;
  try {
    fs.writeFileSync(filePath, jsonDoc);
  } catch (err) {
    throw new BadRequestException(err.message);
  }
  return filePath;
};

export const convertFileTOJson = (data) => {
  try {
    const dataFormated = JSON.parse(data.Body.toString());
    return dataFormated;
  } catch (e) {
    throw new BadRequestException(e.message);
  }
};

export const deleteFile = (file: string) => {
  return fs.unlinkSync(file);
};
