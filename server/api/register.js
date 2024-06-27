import { defineEventHandler, readBody } from 'h3';
import { google } from 'googleapis';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { username, password, email } = body;

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

  try {
    // Check if username already exists in UserInfo sheet
    const userInfoResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'UserInfo!A1:A', // Adjust the range to cover the Username column
    });

    const usernames = userInfoResponse.data.values ? userInfoResponse.data.values.flat() : [];
    if (usernames.includes(username)) {
      return { success: false, error: 'Username already exists. Please choose a different username.' };
    }

    // Add to UserInfo sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'UserInfo!A1',
      valueInputOption: 'RAW',
      resource: {
        values: [[username, password, email]],
      },
    });

    // Add to Users sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'auth!A1',
      valueInputOption: 'RAW',
      resource: {
        values: [[username, password]],
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error registering user:', error);
    return { success: false, error: 'An error occurred while registering the user.' };
  }
});
