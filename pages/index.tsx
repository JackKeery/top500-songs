import { useState, useEffect } from "react";

type Song = {
  Rank: string;
  Song: string;
  Artist: string;
  Year: string;
  Genre: string;
};

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    fetch("/api/songs")
      .then((res) => res.json())
      .then((data: Song[]) => setSongs(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="container">
      <h1>🎵 Top 500 Songs 🎵</h1>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Song</th>
            <th>Artist</th>
            <th>Year</th>
            <th>Genre</th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song, index) => (
            <tr key={index}>
              <td>{song.Rank}</td>
              <td>{song.Song}</td>
              <td>{song.Artist}</td>
              <td>{song.Year}</td>
              <td>{song.Genre}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <style jsx>{`
        .container {
          text-align: center;
          padding: 20px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
        }
        th {
          background-color: #f4f4f4;
        }
      `}</style>
    </div>
  );
}