import { useEffect, useState } from "react";

type Song = {
  rank: string;
  title: string;
  artist: string;
  released: string;
  rating: string;
};

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch("/api/songs")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: Song[]) => {
        setSongs(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load songs");
        setLoading(false);
      });
  }, []);

  const totalPages = Math.ceil(songs.length / pageSize);
  const start = (currentPage - 1) * pageSize;
  const pageSongs = songs.slice(start, start + pageSize);

  function handlePageSizeChange(size: number) {
    setPageSize(size);
    setCurrentPage(1);
  }

  return (
    <div className="container">
      <h1>🎵 Top 500 Songs 🎵</h1>

      {loading && <p className="status">Loading…</p>}
      {error && <p className="status error">{error}</p>}

      {!loading && !error && (
        <>
          <div className="controls">
            <span className="label">Show</span>
            {PAGE_SIZE_OPTIONS.map((size) => (
              <button
                key={size}
                className={`size-btn${pageSize === size ? " active" : ""}`}
                onClick={() => handlePageSizeChange(size)}
              >
                {size}
              </button>
            ))}
            <span className="label">per page</span>
            <span className="total">{songs.length} songs</span>
          </div>

          <table>
            <thead>
              <tr>
                <th className="col-rank">Rank</th>
                <th className="col-title">Title</th>
                <th className="col-artist">Artist</th>
                <th className="col-released">Released</th>
                <th className="col-rating">Rating</th>
              </tr>
            </thead>
            <tbody>
              {pageSongs.map((song) => (
                <tr key={song.rank}>
                  <td className="col-rank">{song.rank}</td>
                  <td className="col-title">{song.title}</td>
                  <td className="col-artist">{song.artist}</td>
                  <td className="col-released">{song.released}</td>
                  <td className="col-rating">{song.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button
              className="page-btn"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              ← Prev
            </button>
            <span className="page-info">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="page-btn"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next →
            </button>
          </div>
        </>
      )}

      <style jsx>{`
        .container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 32px 24px;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        h1 {
          text-align: center;
          font-size: 2rem;
          margin-bottom: 24px;
          letter-spacing: 0.02em;
        }

        .status {
          text-align: center;
          padding: 40px;
          opacity: 0.6;
          font-size: 1.1rem;
        }

        .status.error {
          color: #e55;
          opacity: 1;
        }

        .controls {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .label {
          font-size: 0.9rem;
          opacity: 0.7;
        }

        .total {
          margin-left: auto;
          font-size: 0.85rem;
          opacity: 0.5;
        }

        .size-btn {
          padding: 4px 12px;
          border: 1px solid currentColor;
          border-radius: 4px;
          background: transparent;
          cursor: pointer;
          font-size: 0.85rem;
          opacity: 0.6;
          transition: opacity 0.15s, background 0.15s;
        }

        .size-btn:hover {
          opacity: 1;
        }

        .size-btn.active {
          background: #4a90d9;
          border-color: #4a90d9;
          color: #fff;
          opacity: 1;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 0.92rem;
        }

        th {
          text-align: left;
          padding: 10px 14px;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          opacity: 0.6;
          border-bottom: 2px solid rgba(128, 128, 128, 0.2);
        }

        td {
          padding: 10px 14px;
          border-bottom: 1px solid rgba(128, 128, 128, 0.1);
        }

        tr:hover td {
          background: rgba(128, 128, 128, 0.06);
        }

        .col-rank {
          width: 70px;
          text-align: center;
        }

        .col-released {
          width: 90px;
        }

        .col-rating {
          width: 80px;
          text-align: center;
        }

        .pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-top: 24px;
        }

        .page-btn {
          padding: 6px 16px;
          border: 1px solid rgba(128, 128, 128, 0.4);
          border-radius: 4px;
          background: transparent;
          cursor: pointer;
          font-size: 0.9rem;
          transition: opacity 0.15s;
        }

        .page-btn:disabled {
          opacity: 0.25;
          cursor: default;
        }

        .page-btn:not(:disabled):hover {
          border-color: #4a90d9;
          color: #4a90d9;
        }

        .page-info {
          font-size: 0.9rem;
          opacity: 0.7;
          min-width: 120px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}
