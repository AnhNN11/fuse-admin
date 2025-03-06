import HomepageClubInfomationContainer from "@/components/modules/Clubs/HomepageClubInformationContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NextTeam | Câu lạc bộ",
};

function ClubInfomationPage() {
  return <HomepageClubInfomationContainer />;
}

export default ClubInfomationPage;
