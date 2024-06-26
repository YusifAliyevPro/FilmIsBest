"use client";

import { Motion } from "./Motion";
import useStore from "@/lib/store";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function Movies({ movies }) {
  const search = useStore((state) => state.search);
  const page = useStore((state) => state.page);
  const setResultCount = useStore((state) => state.setResultCount);
  let renderedMovies;
  if (search) {
    renderedMovies = movies.filter((movie) =>
      movie.filmName.toLowerCase().includes(search.toLowerCase()),
    );
  } else {
    renderedMovies = movies.slice((page - 1) * 20, page * 20);
  }
  useEffect(() => {
    setResultCount(renderedMovies.length);
  }, [renderedMovies]);
  return (
    <div className="justify-content-center mx-2.5 flex flex-wrap items-center justify-center gap-x-10">
      {renderedMovies.map((movie, index) => (
        <Motion
          key={index + 20 * (page - 1)}
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.2, type: "spring", stiffness: 110 }}
        >
          <Link
            href={`movies/${movie.slug.current}`}
            className="justify-content-center relative mt-10 inline-block min-h-10 w-[260px] select-none items-center justify-center rounded-xl bg-gray-200 text-center"
          >
            <div>
              <div className="relative">
                <Image
                  src={movie.poster}
                  alt={movie.filmName + " movie poster"}
                  width={260}
                  height={380}
                  priority
                  className="h-[380px] rounded-10"
                />
                <div className="absolute top-2.5 flex w-[260px] flex-row justify-around gap-36 p-2.5">
                  <div className="rounded-3xl bg-rdate px-1 text-center text-xs font-bold text-white">
                    {movie.releaseDate}
                  </div>
                  <div className="w-8 rounded-3xl bg-imdb text-center text-xs font-bold text-gray-100">
                    {parseFloat(movie.imdbpuan).toFixed(1)}
                  </div>
                </div>
              </div>
              <div className="justify-content-center relative flex min-h-13 w-[250px] flex-col items-center justify-center text-center">
                <p
                  className="w-[200px] truncate text-lg font-bold text-white hover:text-blue-800"
                  title={movie.filmName}
                >
                  {movie.filmName}
                </p>
              </div>
            </div>
          </Link>
        </Motion>
      ))}
    </div>
  );
}
