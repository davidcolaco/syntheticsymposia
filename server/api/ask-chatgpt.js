import { defineEventHandler, readBody } from 'h3';
import { google } from 'googleapis';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { starterPrompt, question, username } = body;

  const apiKey = process.env.OPENAI_API_KEY;
  const apiUrl = 'https://api.openai.com/v1/chat/completions';

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: starterPrompt },
          { role: 'user', content: question },
        ],
        max_tokens: 150,
      }),
    });
    const result = await response.json();
    console.log('OpenAI Response:', result);

    let answer;
    let tokenUsage;
    if (result.choices && result.choices.length > 0) {
      answer = result.choices[0].message.content.trim();
      tokenUsage = result.usage.total_tokens; // Assuming the response includes token usage
    } else {
      console.error('OpenAI returned no choices:', result);
      answer = 'No answer returned from OpenAI.';
      tokenUsage = 0;
    }

    // Store the question, answer, username, and token usage in Google Sheets
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
    const range = 'ChatLogs!A1'; // Adjust the range as needed

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      resource: {
        values: [[new Date().toISOString(), username, question, answer, tokenUsage]],
      },
    });

    return { success: true, answer };
  } catch (error) {
    console.error('Error getting response from OpenAI or storing in Google Sheets:', error);
    return { success: false, error: 'Failed to get an answer or store it.' };
  }
});
