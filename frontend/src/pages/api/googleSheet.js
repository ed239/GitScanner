import { google } from "googleapis";
import keys from "../../../google-sheets-key";

export default async function handler(req, res) {
    try {
        const client = new google.auth.JWT(
            keys.client_email, null, keys.private_key, ['https://www.googleapis.com/auth/spreadsheets']
        );

        client.authorize(async function(err, tokens) {
            if (err) {
                return res.status(400).json({ error: true, message: 'Authorization error' });
            }

            const gsapi = google.sheets({ version: 'v4', auth: client });

            const opt = {
                spreadsheetId: '1QzlGUleiC1LaSEJJnlij5GbS3PcG9hif37J6gF6mGZk', // ID of google sheets
                range: 'Sheet1' // pull data from entire sheet
            };

            // api request to get values from the spreadsheet
            try {
                let data = await gsapi.spreadsheets.values.get(opt);
                return res.status(200).json({ error: false, data: data.data.values });
            } catch (e) {
                return res.status(400).json({ error: true, message: 'Error fetching data from Google Sheets' });
            }
        });
    } catch (e) {
        return res.status(400).json({ error: true, message: 'Unexpected error occurred' });
    }
}
