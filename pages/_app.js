import "@/styles/globals.css";
import styles from '@/styles/app.module.css';
import Head from "next/head";

export default function App ({ Component, pageProps }) {
  console.log("function App");

  return (
    <>
      <Head>
        <title>電卓</title>
        <meta name="description" content="next-first-app" />
        <meta name="viewport" content="target-densitydpi=device-dpi, width=320, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <div className={styles.App}>
        <Component {...pageProps} />
      </div>
    </>
  );
}
