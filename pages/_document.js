import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="fa" dir="rtl">
        <Head>  <link rel="icon" type="image/png" href="pic/logo.png" />
       </Head>
      <body className={`antialiased`}>
        <div id="modal-root"></div>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
