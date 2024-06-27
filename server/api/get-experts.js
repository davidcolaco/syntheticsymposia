import { defineEventHandler } from 'h3';
import { google } from 'googleapis';

export default defineEventHandler(async () => {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const expertRange = 'Experts!A1:C100'; // Adjust the range as needed

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: expertRange,
    });

    const rows = response.data.values;
    if (rows.length) {
      const experts = rows.map(row => ({
        name: row[0],
        description: row[1],
        imageUrl: row[2], // Assuming the third column contains image URLs
      }));
      return { success: true, experts };
    } else {
      return { success: false, error: 'No experts found' };
    }
  } catch (error) {
    console.error('Error fetching experts:', error);
    return { success: false, error: 'An error occurred' };
  }
});
