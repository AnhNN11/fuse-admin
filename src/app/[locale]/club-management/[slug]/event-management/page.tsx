import { Metadata } from "next";

import ClubEventManagement from "@/components/modules/EventsManagement/ClubEventManagement";

export const metadata: Metadata = {
  title: "FU-DEVER | Quản lý sự kiện",
};

export default function UserManagementPage() {
  return <ClubEventManagement />;
}
