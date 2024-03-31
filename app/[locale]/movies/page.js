import { Suspense } from "react";
import { client } from "@/sanity/lib/client";
import Movies from "../components/movies";
import PaginationUI from "../components/pagination";
import Search from "../components/search";
import SearchSkeleton from "../components/searchSkeleton";
import PaginationSkeleton from "../components/paginationSkeleton";
import { baseURL } from "../lib/bases";
import { MotionDiv } from "../components/motionDiv";
import { useLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
const ogImage = {
  url: `${baseURL}/FilmIsBest.png`,
  width: 1080,
  height: 1080,
  alt: "FilmIsBest",
  type: "image/png",
};

export async function generateMetadata() {
  const locale = useLocale();
  const t = await getTranslations({ locale, namespace: "MetaData.Movies" });
  return {
    title: t("title"),
    url: `${baseURL}/movies`,
    description: t("description"),
    alternates: {
      canonical: `${baseURL}/movies`,
      languages: {
        "en-US": `${baseURL}/en/movies`,
        "en-GB": `${baseURL}/en/movies`,
        "az-AZ": `${baseURL}/az/movies`,
      },
    },
    openGraph: {
      description: t("description"),
      images: [ogImage],
      title: `FilmIsBest | ${t("title")}`,
      url: `${baseURL}/${locale}/movies`,
    },
  };
}

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
        <Suspense fallback={<SearchSkeleton />}>
          <Search
            searchQuery={search}
            resultCount={resultCount}
            pageQuery={page}
          />
        </Suspense>
        <Suspense fallback={<PaginationSkeleton />}>
          <PaginationUI
            searchQuery={search}
            resultCount={resultCount}
            pageQuery={page}
            count={count}
          />
        </Suspense>
      </div>
      <MotionDiv
        initial={{ y: 600 }}
        animate={{ y: 0 }}
        transition={{
          duration: 1.2,
          type: "spring",
          stiffness: 55,
        }}
      >
        <Suspense>
          <Movies movies={movies} />
        </Suspense>
      </MotionDiv>
    </main>
  );
}