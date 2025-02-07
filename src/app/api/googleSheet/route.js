// src/app/api/googleSheet/route.js

import { google } from 'googleapis';

export async function POST(req) {
  const data = await req.json();

  try {
    // Handle saving data to Google Sheets (replace with your Google Sheets logic)
    const credentials = {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      project_id: process.env.GOOGLE_PROJECT_ID,
    };

    const sheets = google.sheets('v4');
    const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;

    const auth = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      ['https://www.googleapis.com/auth/spreadsheets'],
      null
    );

    // Save the form data to the Google Sheets document
    const res = await sheets.spreadsheets.values.append({
      auth,
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A1',  // Adjust the range based on your sheet's structure
      valueInputOption: 'RAW',
      resource: {
        values: [Object.values(data)],  // Send form data as values to the sheet
      },
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
}
