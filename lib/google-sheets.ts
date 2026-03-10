import { google } from 'googleapis';

export const getGoogleSheetsClient = async () => {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        // Bagian ini krusial: replace \n agar private key terbaca dengan benar di Vercel
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    return google.sheets({ version: 'v4', auth });
  } catch (error) {
    console.error("Gagal inisialisasi Google Sheets Client:", error);
    throw error;
  }
};
