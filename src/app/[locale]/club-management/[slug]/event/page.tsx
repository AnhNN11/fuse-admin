import { Metadata } from "next";

import EventClubList from "@/components/modules/EventsManagement/EventClubList";

export const metadata: Metadata = {
  title: "FU-DEVER | Sự kiện câu lạc bộ",
};

export default function UserManagementPage() {
  return <EventClubList />;
}
