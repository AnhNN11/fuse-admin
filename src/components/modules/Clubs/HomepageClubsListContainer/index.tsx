"use client";

import { Tabs } from "antd";
import { useParams } from "next/navigation";
import { useTranslation } from "@/app/i18n/client";

import HomepageClubsListComponent from "../HomepageClubsListComponent";
import HomepageMyClubComponent from "../HomepageMyClubComponent";
import HomepageClubsRankComponent from "../HomepageClubRankComponent";
import { useAppSelector } from "@/hooks/redux-toolkit";

function HomepageClubsListContainer() {
  const params = useParams();
  const { userInfo } = useAppSelector((state) => state.auth);

  const { t } = useTranslation(params?.locale as string, "clubs");

  const tabsItems = [
    { label: t("clubs"), key: `1`, children: <HomepageClubsListComponent /> },
    {
      label: t("myClubs"),
      key: `2`,
      children: <HomepageMyClubComponent />,
    },
    {
      label: t("clubRankings"),
      key: `3`,
      children: <HomepageClubsRankComponent />,
    },
  ];

  const tabsItemsNotAuth = [
    { label: t("clubs"), key: `1`, children: <HomepageClubsListComponent /> },
    {
      label: t("clubRankings"),
      key: `2`,
      children: <HomepageClubsRankComponent />,
    },
  ];

  return (
    <Tabs
      defaultActiveKey="1"
      centered
      items={userInfo ? tabsItems : tabsItemsNotAuth}
    />
  );
}

export default HomepageClubsListContainer;
