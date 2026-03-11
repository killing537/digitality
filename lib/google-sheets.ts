import { google } from 'googleapis';

export const getGoogleSheetsClient = async () => {
  // Ambil key dan bersihkan
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;
  
  // Perbaikan: Menangani karakter \n yang tertulis sebagai teks
  const formattedKey = rawKey ? rawKey.replace(/\\n/g, '\n') : undefined;

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: formattedKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
};
