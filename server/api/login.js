import { defineEventHandler, readBody } from 'h3';
import { google } from 'googleapis';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'your-secret-key'; // Replace with a strong secret key

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { username, password } = body;

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const userRange = 'auth!A1:C100'; // Adjust the range to cover the username, password, and email columns

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: userRange,
    });

    const rows = response.data.values;
    if (rows) {
      const user = rows.find(row => row[0] === username && row[1] === password);
      if (user) {
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });

        // Check if the LoginLogs sheet exists and create it if it doesn't
        try {
          await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: 'LoginLogs!A1',
          });
        } catch (error) {
          if (error.message.includes('Unable to parse range')) {
            await sheets.spreadsheets.batchUpdate({
              spreadsheetId,
              resource: {
                requests: [
                  {
                    addSheet: {
                      properties: {
                        title: 'LoginLogs',
                      },
                    },
                  },
                ],
              },
            });
          } else {
            throw error;
          }
        }

        // Log the login time
        const loginTime = new Date().toISOString();
        await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: 'LoginLogs!A1',
          valueInputOption: 'RAW',
          resource: {
            values: [[username, loginTime]],
          },
        });

        return { success: true, token, username: user[0], email: user[2] };
      }
    }

    return { success: false };
  } catch (error) {
    console.error('Error checking credentials:', error);
    return { success: false, error: 'An error occurred' };
  }
});
