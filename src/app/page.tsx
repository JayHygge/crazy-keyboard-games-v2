"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

// Type for a game
interface Game {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  tags: string;
  thumb: string;
}

// Simple GameCard component
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

export default function Home() {
  const [search, setSearch] = useState("");
  const [recentlyPlayed, setRecentlyPlayed] = useState<Game[]>([]);
  const [showCookie, setShowCookie] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [gamesData, setGamesData] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get up to 4 recently played game IDs from localStorage
    const ids = JSON.parse(
      localStorage.getItem("recentlyPlayed") || "[]"
    ) as string[];
    // Find the corresponding games
    const games = ids
      .map((id) => gamesData.find((g) => g.id === id))
      .filter(Boolean)
      .slice(0, 4) as Game[];
    setRecentlyPlayed(games);
  }, [gamesData]);

  useEffect(() => {
    setShowCookie(localStorage.getItem("cookieNotice") !== "dismissed");
  }, []);

  useEffect(() => {
    setFavorites(JSON.parse(localStorage.getItem("favorites") || "[]"));
  }, []);

  useEffect(() => {
    fetch("/games.json")
      .then((res) => res.json())
      .then((data) => {
        setGamesData(data);
        setLoading(false);
      });
  }, []);

  const popularGames = useMemo(() => {
    // Shuffle and pick 8 random games
    const shuffled = [...gamesData].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 8);
  }, [gamesData]);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    gamesData.forEach((game) => {
      if (game.category) cats.add(game.category);
    });
    return Array.from(cats).sort();
  }, [gamesData]);

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // For now, just log the search term
    console.log("Search:", search);
  }

  function handleCategoryClick(category: string) {
    // For now, just log the category
    console.log("Category clicked:", category);
  }

  function dismissCookie() {
    setShowCookie(false);
    localStorage.setItem("cookieNotice", "dismissed");
  }

  function openPrivacy(e: React.MouseEvent) {
    e.preventDefault();
    setShowPrivacy(true);
  }

  function closePrivacy() {
    setShowPrivacy(false);
  }

  function toggleFavorite(id: string) {
    setFavorites((prev) => {
      const next = prev.includes(id)
        ? prev.filter((f) => f !== id)
        : [...prev, id];
      localStorage.setItem("favorites", JSON.stringify(next));
      return next;
    });
  }

  const favoriteGames = useMemo(() => {
    return gamesData.filter((g) => favorites.includes(g.id)).slice(0, 8);
  }, [favorites, gamesData]);

  useEffect(() => {
    if (!showPrivacy) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closePrivacy();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showPrivacy]);

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
        .slice(0, 4) as Game[];
      return games;
    });
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="w-full py-4 px-6 flex items-center justify-between shadow-sm bg-white/70 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <span className="font-bold text-xl tracking-tight">
            🎮 Crazy Keyboard Games
          </span>
        </div>
        <nav
          className="flex gap-6 text-base font-medium"
          aria-label="Main navigation"
        >
          <a href="#recent" className="hover:underline">
            Recent
          </a>
          <a href="#popular" className="hover:underline">
            Popular
          </a>
          <a href="#categories" className="hover:underline">
            Categories
          </a>
        </nav>
        <form
          className="hidden md:block"
          onSubmit={handleSearchSubmit}
          role="search"
          aria-label="Search games"
        >
          <input
            type="search"
            placeholder="Search games..."
            className="rounded-full px-4 py-1.5 border border-gray-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            aria-label="Search games"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
      </header>

      {/* Hero Banner */}
      <section className="flex flex-col items-center justify-center py-12 px-4 bg-gradient-to-br from-blue-100/60 to-purple-100/40 text-center">
        <h1 className="text-3xl sm:text-5xl font-extrabold mb-2">
          100+ Keyboard & Mouse Games
        </h1>
        <p className="text-lg sm:text-2xl mb-6 text-gray-700">
          Play instantly. No downloads. Just fun.
        </p>
        <a
          href="#popular"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg hover:bg-blue-700 transition"
        >
          Play Now
        </a>
      </section>

      {/* Recently Played */}
      <section id="recent" className="max-w-5xl mx-auto w-full py-10 px-4">
        <h2 className="text-2xl font-bold mb-4">Recently Played</h2>
        {recentlyPlayed.length === 0 ? (
          <div className="bg-white/60 rounded-xl shadow p-6 min-h-[120px] flex items-center justify-center text-gray-500">
            <span>
              No games played yet. Start playing to see your recent games here!
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {recentlyPlayed.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                isFavorite={favorites.includes(game.id)}
                onToggleFavorite={toggleFavorite}
                onPlay={addRecentlyPlayed}
              />
            ))}
          </div>
        )}
        <div className="mt-4 text-right">
          <a href="#" className="text-blue-600 hover:underline font-medium">
            View All
          </a>
        </div>
      </section>

      {/* Popular Games */}
      <section id="popular" className="max-w-5xl mx-auto w-full py-10 px-4">
        <h2 className="text-2xl font-bold mb-4">Popular Games</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {popularGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              isFavorite={favorites.includes(game.id)}
              onToggleFavorite={toggleFavorite}
              onPlay={addRecentlyPlayed}
            />
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link
            href="/all-games"
            className="text-blue-600 hover:underline font-medium"
          >
            View All Games
          </Link>
        </div>
      </section>

      {/* Browse by Category */}
      <section id="categories" className="max-w-5xl mx-auto w-full py-10 px-4">
        <h2 className="text-2xl font-bold mb-4">Browse by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <button
              key={cat}
              className="bg-white/60 rounded-lg shadow p-6 flex items-center justify-center text-lg font-semibold text-gray-700 hover:bg-blue-100 transition cursor-pointer w-full"
              onClick={() => handleCategoryClick(cat)}
              type="button"
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Favorites */}
      <section id="favorites" className="max-w-5xl mx-auto w-full py-10 px-4">
        <h2 className="text-2xl font-bold mb-4">Favorites</h2>
        {favoriteGames.length === 0 ? (
          <div className="bg-white/60 rounded-xl shadow p-6 min-h-[120px] flex items-center justify-center text-gray-500">
            <span>
              No favorites yet. Click the heart on any game to add it here!
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {favoriteGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                isFavorite={true}
                onToggleFavorite={toggleFavorite}
                onPlay={addRecentlyPlayed}
              />
            ))}
          </div>
        )}
      </section>

      {/* About & Contact */}
      <section className="max-w-3xl mx-auto w-full py-10 px-4 text-center text-gray-600">
        <h2 className="text-xl font-bold mb-2">About Crazy Keyboard Games</h2>
        <p className="mb-4">
          A modern, distraction-free portal for instant keyboard and mouse
          games. Built with Next.js, Tailwind CSS, and TypeScript.
        </p>
        <p>
          Contact:{" "}
          <a
            href="mailto:hello@crazykeyboardgames.com"
            className="text-blue-600 hover:underline"
          >
            hello@crazykeyboardgames.com
          </a>
        </p>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 px-4 text-center text-sm text-gray-500 bg-white/70 backdrop-blur-md mt-auto">
        <div>© 2025 Crazy Keyboard Games. All rights reserved.</div>
        <a
          href="#"
          className="text-blue-600 hover:underline ml-2"
          onClick={openPrivacy}
        >
          Privacy Policy
        </a>
      </footer>

      {/* Cookie Notice */}
      {showCookie && (
        <div className="fixed bottom-0 left-0 w-full z-50 flex justify-center">
          <div className="bg-white/95 border border-gray-200 shadow-lg rounded-t-xl px-6 py-4 flex flex-col sm:flex-row items-center gap-4 max-w-2xl w-full sm:w-auto mx-2 mb-2">
            <span className="text-gray-700 text-sm">
              This site uses cookies to enhance your experience. By continuing,
              you agree to our{" "}
              <a href="#" className="text-blue-600 underline">
                cookie policy
              </a>
              .
            </span>
            <button
              onClick={dismissCookie}
              className="bg-blue-600 text-white rounded-full px-4 py-1.5 font-semibold hover:bg-blue-700 transition text-sm"
              aria-label="Dismiss cookie notice"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacy && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          aria-modal="true"
          role="dialog"
          tabIndex={-1}
          onClick={closePrivacy}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 relative"
            onClick={(e) => e.stopPropagation()}
            tabIndex={0}
          >
            <button
              onClick={closePrivacy}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold"
              aria-label="Close privacy policy"
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-2">Privacy Policy</h2>
            <p className="text-sm text-gray-700 mb-2">
              This site does not collect personal data. Recently played and
              favorite games are stored only in your browser (localStorage). No
              login or tracking is used. For questions, contact{" "}
              <a
                href="mailto:hello@crazykeyboardgames.com"
                className="text-blue-600 underline"
              >
                hello@crazykeyboardgames.com
              </a>
              .
            </p>
            <p className="text-xs text-gray-500">Last updated: 2025</p>
          </div>
        </div>
      )}
    </div>
  );
}
