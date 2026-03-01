import { google } from 'googleapis'

export async function getGoogleSheetsClient() {
    const target = ['https://www.googleapis.com/auth/spreadsheets'];
    const jwt = new google.auth.JWT(
        process.env.GOOGLE_CLIENT_EMAIL,
        null,
        (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
        target
    );

    const sheets = google.sheets({ version: 'v4', auth: jwt });
    return sheets;
}

export async function appendToSheet(row: any[]) {
    try {
        const sheets = await getGoogleSheetsClient()
        const spreadsheetId = process.env.GOOGLE_SHEET_ID

        // First, verify the sheet exists and try to add headers if empty
        try {
            const response = await sheets.spreadsheets.values.get({
                spreadsheetId,
                range: 'Sheet1!A1:A1',
            })
            if (!response.data.values || response.data.values.length === 0) {
                await sheets.spreadsheets.values.append({
                    spreadsheetId,
                    range: 'Sheet1!A1',
                    valueInputOption: 'USER_ENTERED',
                    requestBody: {
                        values: [[
                            'Submission ID', 'Submission Date', 'First Name', 'Last Name',
                            'Email', 'Department', 'Position', 'Metric Type', 'Points',
                            'Proof Type', 'Proof URL', 'Image Preview', 'Status',
                            'Reviewed At', 'Admin Note'
                        ]],
                    },
                })
            }
        } catch (e) {
            // Ignore error if sheet check fails, just proceed to append
            console.warn("Could not check/add headers to Google Sheet:", e)
        }

        await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: 'Sheet1',
            valueInputOption: 'USER_ENTERED',
            insertDataOption: 'INSERT_ROWS',
            requestBody: {
                values: [row],
            },
        })
        return { success: true }
    } catch (error: any) {
        console.error('Error appending to Google Sheet:', error)
        return { success: false, error: error.message }
    }
}

export async function resyncEntireSheet(rows: any[][]) {
    try {
        const sheets = await getGoogleSheetsClient()
        const spreadsheetId = process.env.GOOGLE_SHEET_ID

        // Clear existing data (keeping headers if we clear from A2)
        await sheets.spreadsheets.values.clear({
            spreadsheetId,
            range: 'Sheet1!A2:Z',
        })

        // Add all new rows
        if (rows.length > 0) {
            await sheets.spreadsheets.values.append({
                spreadsheetId,
                range: 'Sheet1!A2',
                valueInputOption: 'USER_ENTERED',
                requestBody: {
                    values: rows,
                },
            })
        }
        return { success: true }
    } catch (error: any) {
        console.error('Error resyncing Google Sheet:', error)
        return { success: false, error: error.message }
    }
}
