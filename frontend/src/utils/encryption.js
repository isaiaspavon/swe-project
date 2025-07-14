// src/utils/encryption.js
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'my_super_secret_key_123!'; // ideally from .env in production

export const encryptData = (plainText) => {
  return CryptoJS.AES.encrypt(plainText, SECRET_KEY).toString();
};

export const decryptData = (cipherText) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
