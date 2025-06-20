"use client";
import { useState, useEffect, useMemo } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import Link from "next/link";

interface Game {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  tags: string;
  thumb: string;
}

function GameCard({
  game,
  isFavorite,
  onToggleFavorite,
  onPlay,
}: {
  game: Game;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  onPlay?: (id: string) => void;
}) {
  function handlePlay(e: React.MouseEvent) {
    if (onPlay) {
      e.preventDefault();
      onPlay(game.id);
      window.open(game.url, "_blank");
    }
  }
  return (
    <div className="relative group">
      <a
        href={game.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-white/80 rounded-lg shadow hover:shadow-lg transition overflow-hidden"
        onClick={onPlay ? handlePlay : undefined}
      >
        <img
          src={game.thumb}
          alt={game.title}
          className="w-full h-32 object-cover group-hover:scale-105 transition cursor-pointer"
          width={256}
          height={128}
          loading="lazy"
        />
        <div className="p-3">
          <h3 className="font-semibold text-base mb-1 truncate cursor-pointer">
            {game.title}
          </h3>
          <p className="text-xs text-gray-500 truncate">{game.category}</p>
        </div>
      </a>
      {onToggleFavorite && (
        <button
          onClick={() => onToggleFavorite(game.id)}
          className="absolute top-2 right-2 bg-white/80 rounded-full p-1.5 shadow hover:bg-pink-100 transition"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? (
            <FaHeart className="text-pink-500" />
          ) : (
            <FaRegHeart className="text-gray-400 group-hover:text-pink-500 transition" />
          )}
        </button>
      )}
    </div>
  );
}

export default function RecentlyPlayedPage() {
  const [gamesData, setGamesData] = useState<Game[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Game[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/games.json")
      .then((res) => res.json())
      .then((data) => {
        setGamesData(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setFavorites(JSON.parse(localStorage.getItem("favorites") || "[]"));
    const ids = JSON.parse(
      localStorage.getItem("recentlyPlayed") || "[]"
    ) as string[];
    const games = ids
      .map((id) => gamesData.find((g) => g.id === id))
      .filter(Boolean)
      .slice(0, 20) as Game[];
    setRecentlyPlayed(games);
  }, [gamesData]);

  function toggleFavorite(id: string) {
    setFavorites((prev) => {
      const next = prev.includes(id)
        ? prev.filter((f) => f !== id)
        : [...prev, id];
      localStorage.setItem("favorites", JSON.stringify(next));
      return next;
    });
  }

  function addRecentlyPlayed(id: string) {
    setRecentlyPlayed((prev) => {
      const ids = [
        id,
        ...prev.map((g) => g.id).filter((gid) => gid !== id),
      ].slice(0, 20);
      localStorage.setItem("recentlyPlayed", JSON.stringify(ids));
      const games = ids
        .map((gid) => gamesData.find((g) => g.id === gid))
        .filter(Boolean)
        .slice(0, 20) as Game[];
      return games;
    });
  }

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    gamesData.forEach((game) => {
      if (game.category) cats.add(game.category);
    });
    return Array.from(cats).sort();
  }, [gamesData]);

  // Filtered games
  const filteredGames = useMemo(() => {
    let games = recentlyPlayed;
    if (activeCategory)
      games = games.filter((g) => g.category === activeCategory);
    if (!search.trim()) return games;
    return games.filter(
      (g) =>
        g.title.toLowerCase().includes(search.toLowerCase()) ||
        g.description.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, recentlyPlayed, activeCategory]);

  if (loading) return <div className="text-center py-10">Loading games...</div>;

  return (
    <main className="min-h-screen bg-background text-foreground px-4 py-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Recently Played</h1>
        <Link href="/" className="text-blue-600 hover:underline font-medium">
          ← Back to Home
        </Link>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="search"
          placeholder="Search games..."
          className="rounded-full px-4 py-2 border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm w-full sm:w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="rounded-full px-4 py-2 border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm w-full sm:w-48"
          value={activeCategory}
          onChange={(e) => setActiveCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {filteredGames.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            isFavorite={favorites.includes(game.id)}
            onToggleFavorite={toggleFavorite}
            onPlay={addRecentlyPlayed}
          />
        ))}
      </div>
      {filteredGames.length === 0 && (
        <div className="text-center text-gray-500 mt-10">No games found.</div>
      )}
    </main>
  );
}
