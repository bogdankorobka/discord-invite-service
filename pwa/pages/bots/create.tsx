import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/bot/Form";

const Page: NextComponentType<NextPageContext> = () => (
  <div>
    <div>
      <Head>
        <title>Create Bot</title>
      </Head>
    </div>
    <Form />
  </div>
);

export default Page;
