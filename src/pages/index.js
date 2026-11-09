import Head from "next/head";
import App from "../App";

export default function Home() {
  return (
    <>
      <Head>
        <title>Local Qwen Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <App />
    </>
  );
}
