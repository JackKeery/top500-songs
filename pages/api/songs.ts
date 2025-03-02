import type { NextApiRequest, NextApiResponse } from "next";

type Song = {
  Rank: string;
  Song: string;
  Artist: string;
  Year: string;
  Genre: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Song[] | { error: string }>
) {
  const { GOOGLE_SHEETS_API_KEY, GOOGLE_SHEET_ID } = process.env;

  const sheetName = "Sheet1"; // Change if needed
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/${sheetName}?key=${GOOGLE_SHEETS_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.values) throw new Error("No data found");

    const headers = data.values[0];
    const rows = data.values.slice(1);

    const songs: Song[] = rows.map((row) => {
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