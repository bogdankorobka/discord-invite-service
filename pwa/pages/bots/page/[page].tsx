import { GetStaticPaths, GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import {
  PageList,
  getBots,
  getBotsPath,
} from "../../../components/bot/PageList";
import { PagedCollection } from "../../../types/collection";
import { Bot } from "../../../types/Bot";
import { fetch, getCollectionPaths } from "../../../utils/dataAccess";

export const getStaticProps: GetStaticProps = async ({
  params: { page } = {},
}) => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getBotsPath(page), getBots(page));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Bot>>("/bots");
  const paths = await getCollectionPaths(response, "bots", "/bots/page/[page]");

  return {
    paths,
    fallback: true,
  };
};

export default PageList;
