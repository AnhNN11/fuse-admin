import HomepageClubsListContainer from "@/components/modules/Clubs/HomepageClubsListContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NextTeam | Câu lạc bộ",
};

function ClubsPage() {
  return <HomepageClubsListContainer />;
}

export default ClubsPage;
