import { useRouter } from "next/router";
import { SessionProvider } from "next-auth/react";
import { ReactElement, ReactNode, useEffect } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { useSession } from "next-auth/react";

import "@/styles/globals.css";
import "../styles/player.css";

import Layout from "../components/Layout";
import { darkTheme } from "../theme";

import type { NextPage } from "next";
import type { AppProps } from "next/app";

import { isProduction } from "@/utils";
import { pageView } from "@/lib/ga";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  auth?: boolean;
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (isProduction) {
        pageView(url);
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  if (router.pathname === "/404") {
    return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    );
  }

  return (
    <SessionProvider session={pageProps.session}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Layout>
          {Component.auth ? (
            <Auth>
              <Component {...pageProps} />
            </Auth>
          ) : (
            <Component {...pageProps} />
          )}
        </Layout>
      </ThemeProvider>
    </SessionProvider>
  );
}

function Auth({ children }: { children: any }) {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const { status } = useSession({ required: true });

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  return children;
}
