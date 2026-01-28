import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    const daysBackParam = searchParams.get('daysBack'); // !== null ? parseInt(searchParams.get('daysBack')) : 0

    const daysBack = daysBackParam !== null ? parseInt(daysBackParam) : 0;

    const logFilePath = path.join(process.cwd(), 'watchlist.log'); // Path to the log file

    try {
        // Check if the file exists
        if (!fs.existsSync(logFilePath)) {
            return new Response(JSON.stringify({ error: 'Log file not found.' }), { status: 404 });
        }

        // Read the file and split it into lines
        const fileContent = fs.readFileSync(logFilePath, 'utf-8');
        const logLines = fileContent.split('\n').filter(Boolean); // Remove empty lines

        const logs: any = [];
        const currentDate: any = new Date();

        // Loop through each log line
        for (const line of logLines) {
            //const [dateString, ...messageParts] = line.split(': '); // Split date and log message
            //const writeLog = messageParts.join(' ');
            //const {dateString, logMessage} = (([, date, msg]) => ({dateString: date, logMessage: msg}))(line.match(/^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) (.+)$/));
            const { dateString, logMessage } = ((m) => m ? { dateString: m[1], logMessage: m[2] } : { dateString: '', logMessage: '' })(line.match(/^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) (.+)$/));

            const logDate: any = new Date(dateString);

            // If daysBack is provided, filter by date
            if (daysBack > 0) {
                const diffTime = currentDate - logDate;
                const diffDays = diffTime / (1000 * 3600 * 24); // Convert milliseconds to days

                if (diffDays > daysBack) {
                    continue; // Skip this log entry if it's older than daysBack
                }
            }

            if (dateString !== "" && logMessage !== "") {
                logs.push({
                    Date: dateString,
                    Message: logMessage,
                });
            }
        }

        return Response.json(["OK", logs]);

    } catch (error: any) {
        return new Response(JSON.stringify({ error: 'Error reading the log file.' }), { status: 500 });
    }
}