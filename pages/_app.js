import { ThemeProvider } from 'next-themes';
import "@/styles/globals.css"; 
import Layout from "@/components/layout/layout";
import Head from 'next/head';


export default function App({ Component, pageProps }) {
  const showSidebar = Component.showSidebar === true;


  return (
    <>
    <Head> <title>فروشگاه آنلاین</title> </Head>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <Layout showSidebar={showSidebar}>
    <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
    </>
  );
}
