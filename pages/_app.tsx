import "styles/index.scss";

import Footer from "components/footer";
import type { AppProps } from "next/app";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Go Bank</title>
      </Head>
      <div className="flex flex-col justify-between min-h-screen border-2">
        <Component {...pageProps} />
        <Footer />
      </div>
    </>
  );
}

export default MyApp;
