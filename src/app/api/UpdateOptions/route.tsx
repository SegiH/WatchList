import { NextRequest } from 'next/server';
import { execSelect, execUpdateDelete, getUserID } from "../lib";
import { IUserOption } from '@/app/interfaces/IUser';

/**
 * @swagger
 * /api/UpdateOption:
 *    put:
 *        tags:
 *          - Option
 *        summary: Update an option
 *        description: Update an option
 *        parameters:
 *           - name: WatchListTypeID
 *             in: query
 *             description: New WatchListType ID
 *             required: true
 *             schema:
 *                  type: string
 *           - name: WatchListTypeName
 *             in: query
 *             description: New WatchListType Name
 *             required: true
 *             schema:
 *                  type: string
 *        responses:
 *          200:
 *            description: '["OK",""] on success, ["ERROR","error message"] on error'
 */
interface OptionColumn {
    columnName: string;
}

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

    const optionsObj : [] = JSON.parse(options.toString());

    // Get the columns for Option table
    const optionColumnsSQL = "SELECT m.name as tableName, p.name as columnName,p.type as columnType FROM sqlite_master m left outer join pragma_table_info((m.name)) p on m.name <> p.name where tableName=? order by tableName, columnName";
    const optionColumnsParams: [string] = ["Options"];

    const optionColumnsResults = await execSelect(optionColumnsSQL, optionColumnsParams);

    const optionsColumns: string[][] = [];

    // Map Option columns from DB schema to array
    optionColumnsResults.map((currentOption: OptionColumn) => {
        optionsColumns.push([currentOption.columnName]);
    });

     // Build SQL from columns in optionsColumns
    let updateSQL = `UPDATE Options SET `;
    let updateParams : (string | number)[] = [];

    for (let i=0; i < optionsColumns.length; i++) {
        // Skip over these 2 columns
        if (optionsColumns[i][0] === "OptionID" || optionsColumns[i][0] === "UserID") {
            continue;
        }

        updateSQL += `${optionsColumns[i][0]}=?` + (i < optionsColumns.length - 1 ? `, ` : ``);
        updateParams.push(optionsObj[optionsColumns[i][0]])
    }

    updateSQL+=` WHERE UserID=?`;
    updateParams.push(userID)

    await execUpdateDelete(updateSQL, updateParams);

    return Response.json(["OK", updateSQL + " " + updateParams]);
}