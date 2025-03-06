import HomepageClubRankComponent from "@/components/modules/Clubs/HomepageClubRankComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NextTeam | Top câu lạc bộ",
};

function ClubInfomationPage() {
  return <HomepageClubRankComponent />;
}

export default ClubInfomationPage;
