import {useEffect, useState} from "react";

type Song = {
  Rank: string;
  Title: string;
  Artist: string;
  Released: string;
  Rating: string;
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
            <th>Title</th>
            <th>Artist</th>
            <th>Released</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song, index) => (
            <tr key={index}>
              <td>{song.Rank}</td>
              <td>{song.Title}</td>
              <td>{song.Artist}</td>
              <td>{song.Released}</td>
              <td>{song.Rating}</td>
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