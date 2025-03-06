import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import ClubLayout from "@/components/core/layouts/ClubLayout";

import { constants } from "@/settings";

export default function RootClubLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const token = getCookie(constants.ACCESS_TOKEN, { cookies });

  // if (!token) {
  //   redirect(`/${locale}/`);
  // }

  return <ClubLayout>{children}</ClubLayout>;
}
