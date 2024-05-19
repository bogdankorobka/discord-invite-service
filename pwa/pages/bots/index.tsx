import { GetStaticProps } from "next";
import { dehydrate, QueryClient } from "react-query";

import { PageList, getBots, getBotsPath } from "../../components/bot/PageList";

export const getStaticProps: GetStaticProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(getBotsPath(), getBots());

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 1,
  };
};

export default PageList;
