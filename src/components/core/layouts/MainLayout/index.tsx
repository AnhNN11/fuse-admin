"use client";

import { AppProgressBar } from "next-nprogress-bar";
import FooterLayoutComponent from "./FooterLayout";
import themeColors from "@/style/themes/default/colors";

import dynamic from "next/dynamic";
const HeaderLayoutComponent = dynamic(() => import("./HeaderLayout"));

function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <HeaderLayoutComponent />
      <AppProgressBar
        height="4px"
        color={themeColors.primary}
        options={{ showSpinner: false }}
        shallowRouting
      />
      <main
        style={{
          minHeight: "100vh",
          maxWidth: 1440,
          margin: "0 auto",
          marginTop: "80px",
          paddingBottom: 80,
          // paddingTop: 80,
        }}
        // style={{
        //   width: 1000,
        //   margin: "0 auto",
        //   paddingBottom: 80,
        // }}
      >
        {children}
      </main>
      <FooterLayoutComponent />
    </>
  );
}

export default MainLayout;
