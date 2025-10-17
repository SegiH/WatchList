import { NextRequest } from 'next/server';
import { getDB, getUserID, logMessage, writeDB } from "../lib";
import IUserOption from '@/app/interfaces/IUser';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    const options = searchParams.get("Options");

    if (options === null) {
        return Response.json({ "ERROR": "Options is not set" });
    }

    const userID = await getUserID(request);

     if (typeof userID != "number") {
          return Response.json(["ERROR", "Access denied"]);
     }

    const newUserOptions: [] = JSON.parse(options.toString());

    try {
        const db: any = await getDB();

        const optionsDB = db.Options;

        const userOptionsResult = optionsDB.filter((option: IUserOption) => {
            return String(option.UserID) === String(userID)
        });

        if (userOptionsResult.length !== 1) {
            return Response.json(["ERROR", "Unable to get the existing user options"]);
        }

        const userOptions = userOptionsResult[0];

        Object.keys(newUserOptions).forEach((newUserOptionKey) => {
            userOptions[newUserOptionKey] = newUserOptions[newUserOptionKey];
        });

        writeDB(db);

        return Response.json(["OK"]);
    } catch (e) {
        logMessage(e.message)
        return Response.json(["ERROR", e.message]);
    }
}