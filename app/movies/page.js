import { Suspense } from "react";
import { client } from "../../sanity/lib/client";
import FormSubmit from "../components/formsubmit";
import Movies from "../components/movies";
import Pagination from "../components/pagination";
import Search from "../components/search";
import Loading from "../loading";

const ogImage = {
  url: "https://filmisbest.com/FilmIsBest.png",
  width: 1080,
  height: 1080,
  alt: "FilmIsBest",
  type: "image/png",
};

export const metadata = {
  title: "Filmlər",
  url: "https://filmisbest.com/movies",
  description:
    "FilmIsBest.com YusifAliyevPro tərəfindən yaradılmışdır. İstədiyiniz bütün filmləri İngiliscə, Türkçə və hər iki dildə altyazı seçimləri ilə izləyə bilərsiz. Həmçinin Film Fraqmanlarınada baxmaq mümkündür.",
  openGraph: {
    description:
      "FilmIsBest.com YusifAliyevPro tərəfindən yaradılmışdır. İstədiyiniz bütün filmləri İngiliscə, Türkçə və hər iki dildə altyazı seçimləri ilə izləyə bilərsiz. Həmçinin Film Fraqmanlarınada baxmaq mümkündür.",
    images: [ogImage],
    title: "FilmIsBest | Filmlər",
    url: "https://filmisbest.com/movies",
  },
};

async function getData({ search, limit }) {
  const query = `*[_type=='Movie-studio' ${search !== undefined ? "&& [filmName, imdbID] match " + `'${search}*'` : ""}]|order(_createdAt desc)${limit}{filmName, "poster": poster.asset->url, slug, _id, imdbpuan, releaseDate}`;
  const data = await client.fetch(
    query,
    { cache: "force-cache" },
    { next: { revalidate: 3600 } },
  );
  return data;
}

export async function getCount() {
  const query = `count(*[_type == "Movie-studio"])`;
  const data = await client.fetch(
    query,
    { cache: "force-cache" },
    { next: { revalidate: 3600 } },
  );
  return data;
}

export default async function MoviesPage({ searchParams }) {
  const search =
    typeof searchParams.search === "string" ? searchParams.search : undefined;
  const page =
    typeof searchParams.page === "string" ? Number(searchParams.page) : 1;
  const count = await getCount();
  const limit = `[${page === 1 ? 0 : (page - 1) * 20}...${page === 1 ? 20 : page * 20}]`;
  const movies = await getData({ search, limit });
  const resultCount = movies.length;
  return (
    <main className="justify-content-center relative mx-auto mb-20 mt-6 flex flex-col items-center justify-center">
      <div className="sm:flx-row relative flex w-full flex-col items-center justify-center">
        <Search
          searchQuery={search}
          resultCount={resultCount}
          pageQuery={page}
        />
        <Pagination
          searchQuery={search}
          resultCount={resultCount}
          pageQuery={page}
          count={count}
        />
      </div>
      <Suspense fallback={<Loading />}>
        <Movies movies={movies} />
      </Suspense>
    </main>
  );
}
