import fs from 'fs';
import path from 'path';
import { env } from '../config/env.js';

export const getUploadPath = (filename) => {
  return `/uploads/${filename}`;
};

export const deleteFile = (filepath) => {
  if (!filepath) return;
  // filepath is usually something like '/uploads/abc.jpg'
  // we need to map it to absolute path
  const absolutePath = path.join(process.cwd(), filepath);
  if (fs.existsSync(absolutePath)) {
    try {
      fs.unlinkSync(absolutePath);
    } catch (e) {
      console.error(`Failed to delete file ${absolutePath}:`, e);
    }
  }
};
