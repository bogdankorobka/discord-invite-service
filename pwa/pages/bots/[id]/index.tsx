import {
  GetStaticPaths,
  GetStaticProps,
  NextComponentType,
  NextPageContext,
} from "next";
import DefaultErrorPage from "next/error";
import Head from "next/head";
import { useRouter } from "next/router";
import { dehydrate, QueryClient, useQuery } from "react-query";

import { Show } from "../../../components/bot/Show";
import { PagedCollection } from "../../../types/collection";
import { Bot } from "../../../types/Bot";
import { fetch, FetchResponse, getItemPaths } from "../../../utils/dataAccess";
import { useMercure } from "../../../utils/mercure";

const getBot = async (id: string | string[] | undefined) =>
  id ? await fetch<Bot>(`/bots/${id}`) : Promise.resolve(undefined);

const Page: NextComponentType<NextPageContext> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data: { data: bot, hubURL, text } = { hubURL: null, text: "" } } =
    useQuery<FetchResponse<Bot> | undefined>(["bot", id], () => getBot(id));
  const botData = useMercure(bot, hubURL);

  if (!botData) {
    return <DefaultErrorPage statusCode={404} />;
  }

  return (
    <div>
      <div>
        <Head>
          <title>{`Show Bot ${botData["@id"]}`}</title>
        </Head>
      </div>
      <Show bot={botData} text={text} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({
  params: { id } = {},
}) => {
  if (!id) throw new Error("id not in query param");
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["bot", id], () => getBot(id));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch<PagedCollection<Bot>>("/bots");
  const paths = await getItemPaths(response, "bots", "/bots/[id]");

  return {
    paths,
    fallback: true,
  };
};

export default Page;
