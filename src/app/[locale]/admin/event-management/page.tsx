import { Metadata } from "next";

import AdminEventManagement from "@/components/modules/EventsManagement/AdminEventManagement";

export const metadata: Metadata = {
  title: "IC-PDP | Quản lý sự kiện",
};

export default function UserManagementPage() {
  return <AdminEventManagement />;
}
