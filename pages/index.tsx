import { useEffect, useState } from "react";

type Song = {
  rank: string;
  title: string;
  artist: string;
  released: string;
  rating: string;
};

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

function tabLabel(tab: string): string {
  return tab === "Top500" ? "Overall" : tab;
}

export default function Home() {
  const [tabs, setTabs] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("Top500");
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetch("/api/tabs")
      .then((res) => res.json())
      .then((data: string[]) => setTabs(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setSongs([]);
    setCurrentPage(1);

    fetch(`/api/songs?tab=${activeTab}`)
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
  }, [activeTab]);

  const totalPages = Math.ceil(songs.length / pageSize);
  const start = (currentPage - 1) * pageSize;
  const pageSongs = songs.slice(start, start + pageSize);

  function handlePageSizeChange(size: number) {
    setPageSize(size);
    setCurrentPage(1);
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        <h1 className="text-3xl sm:text-4xl font-bold text-center tracking-tight mb-8">
          🎵 Top 500 Songs 🎵
        </h1>

        {/* Tab nav — scrolls horizontally on mobile */}
        {tabs.length > 0 && (
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 mb-8">
            <nav className="flex border-b border-zinc-800 min-w-max sm:min-w-0">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
                    activeTab === tab
                      ? "border-blue-500 text-blue-400"
                      : "border-transparent text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {tabLabel(tab)}
                </button>
              ))}
            </nav>
          </div>
        )}

        {loading && (
          <p className="text-center text-zinc-500 py-20 text-lg">Loading…</p>
        )}
        {error && (
          <p className="text-center text-red-400 py-20 text-lg">{error}</p>
        )}

        {!loading && !error && (
          <>
            {/* Controls */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="text-sm text-zinc-500">Show</span>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <button
                  key={size}
                  onClick={() => handlePageSizeChange(size)}
                  className={`px-3 py-1 rounded text-sm border transition-colors ${
                    pageSize === size
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200"
                  }`}
                >
                  {size}
                </button>
              ))}
              <span className="text-sm text-zinc-500">per page</span>
              <span className="ml-auto text-sm text-zinc-600">
                {songs.length} songs
              </span>
            </div>

            {/* Table — scrolls horizontally if needed, Released hidden on mobile */}
            <div className="overflow-x-auto rounded-lg border border-zinc-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="px-4 py-3 w-14 text-center text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      Artist
                    </th>
                    <th className="hidden sm:table-cell px-4 py-3 w-24 text-center text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      Year
                    </th>
                    <th className="px-4 py-3 w-20 text-center text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      Rating
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {pageSongs.map((song) => (
                    <tr
                      key={song.rank}
                      className="hover:bg-zinc-900 transition-colors"
                    >
                      <td className="px-4 py-3 text-center text-zinc-600 tabular-nums text-xs">
                        {song.rank}
                      </td>
                      <td className="px-4 py-3 text-zinc-100 font-medium leading-snug">
                        {song.title}
                      </td>
                      <td className="px-4 py-3 text-zinc-400 leading-snug">
                        {song.artist}
                      </td>
                      <td className="hidden sm:table-cell px-4 py-3 text-center text-zinc-500 tabular-nums">
                        {song.released}
                      </td>
                      <td className="px-4 py-3 text-center text-zinc-300 tabular-nums font-medium">
                        {song.rating}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded border border-zinc-700 text-sm text-zinc-300 hover:border-zinc-500 disabled:opacity-25 disabled:cursor-default transition-colors"
              >
                ← Prev
              </button>
              <span className="text-sm text-zinc-500 min-w-[8rem] text-center">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded border border-zinc-700 text-sm text-zinc-300 hover:border-zinc-500 disabled:opacity-25 disabled:cursor-default transition-colors"
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
