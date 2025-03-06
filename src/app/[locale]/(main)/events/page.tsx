import { Metadata } from "next";

import AllEventList from "@/components/modules/EventsManagement/AllEventList";

export const metadata: Metadata = {
  title: "NextTeam | Sự kiện đang diễn ra",
};

export default function EventPage() {
  return <AllEventList />;
}
