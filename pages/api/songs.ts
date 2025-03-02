import {google} from "googleapis";
import type {NextApiRequest, NextApiResponse} from "next";
import path from "path";

type Song = {
  Rank: string;
  Title: string;
  Artist: string;
  Released: string;
  Rating: string;
};

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Song[] | { error: string }>
) {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(process.cwd(), process.env.GOOGLE_APPLICATION_CREDENTIALS || ""),
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google
        .sheets({ version: "v4", auth });

    const sheetId = process.env.GOOGLE_SHEET_ID;
    const range = "Top500!A1:E501";

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: range,
    });

    const rows = response.data.values;
    if (!rows) throw new Error("No data found in sheet");

    const headers = rows[0];
    const data = rows.slice(1);

    const songs: Song[] = data.map((row) => {
      let songObj: any = {};
      headers.forEach((header, index) => {
        songObj[header] = row[index] || "";
      });
      return songObj as Song;
    });

    res.status(200).json(songs);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}