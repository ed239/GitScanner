import { google } from "googleapis";

export default async function handler(req, res) {

    const requestId = Math.random().toString(36).substring(7); // Generate a unique ID for each request
    console.log(`[${requestId}] API request received at:`, new Date().toISOString());


    try {
        const client = new google.auth.JWT(
            process.env.NEXT_PUBLIC_GOOGLE_SERVICE_ACCOUNT_EMAIL, 
            null, 
            process.env.NEXT_PUBLIC_GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"), 
            ['https://www.googleapis.com/auth/spreadsheets']
        );

        console.log(`[${requestId}] Authorizing client...`);
        await new Promise((resolve, reject) => {
            client.authorize((err, tokens) => {
                if (err) {
                    console.error(`[${requestId}] Authorization error:`, err);
                    reject(new Error('Authorization Error'));
                } else {
                    console.log(`[${requestId}] Client authorized`);
                    resolve(tokens);
                }
            });
        });

        const gsapi = google.sheets({ version: 'v4', auth: client });

        const opt = {
           spreadsheetId: process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID,
            range: 'Sheet1' // pull data from entire sheet
        };

        // api request to get values from the spreadsheet
        console.log(`[${requestId}] Fetching data from Google Sheets...`);
        const data = await gsapi.spreadsheets.values.get(opt);
        console.log(`[${requestId}] Data fetched from Google Sheets: handler`);
        return res.status(200).json({ error: false, data: data.data.values });
    } catch (e) {
        console.error(e);
        return res.status(400).json({ error: true, message: 'Unexpected error occurred' });
    }
}
