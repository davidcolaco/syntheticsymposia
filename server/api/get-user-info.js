import { defineEventHandler } from 'h3';
import { google } from 'googleapis';

export default defineEventHandler(async (event) => {
  const query = new URLSearchParams(event.node.req.url.split('?')[1]);
  const username = query.get('username');

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const userRange = 'UserInfo!A1:C100'; // Adjust the range to cover the username and email columns

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: userRange,
    });

    const rows = response.data.values;
    if (rows) {
      const user = rows.find(row => row[0] === username);
      if (user) {
        return { success: true, email: user[2] };
      }
    }

    return { success: false, error: 'User not found' };
  } catch (error) {
    console.error('Error fetching user info:', error);
    return { success: false, error: 'An error occurred' };
  }
});
