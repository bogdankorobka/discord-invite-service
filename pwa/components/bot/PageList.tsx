import { NextComponentType, NextPageContext } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import { useQuery } from "react-query";

import Pagination from "../common/Pagination";
import { List } from "./List";
import { PagedCollection } from "../../types/collection";
import { Bot } from "../../types/Bot";
import { fetch, FetchResponse, parsePage } from "../../utils/dataAccess";
import { useMercure } from "../../utils/mercure";

export const getBotsPath = (page?: string | string[] | undefined) =>
  `/bots${typeof page === "string" ? `?page=${page}` : ""}`;
export const getBots = (page?: string | string[] | undefined) => async () =>
  await fetch<PagedCollection<Bot>>(getBotsPath(page));
const getPagePath = (path: string) => `/bots/page/${parsePage("bots", path)}`;

export const PageList: NextComponentType<NextPageContext> = () => {
  const {
    query: { page },
  } = useRouter();
  const { data: { data: bots, hubURL } = { hubURL: null } } = useQuery<
    FetchResponse<PagedCollection<Bot>> | undefined
  >(getBotsPath(page), getBots(page));
  const collection = useMercure(bots, hubURL);

  if (!collection || !collection["hydra:member"]) return null;

  return (
    <div>
      <div>
        <Head>
          <title>Bot List</title>
        </Head>
      </div>
      <List bots={collection["hydra:member"]} />
      <Pagination collection={collection} getPagePath={getPagePath} />
    </div>
  );
};
