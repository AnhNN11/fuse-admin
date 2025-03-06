import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NEXTTEAM | Quản lý th",
};

import NotificationsManagementModule from "@/components/modules/NotificationsManagement";

export default function UserManagementPage() {
  return <NotificationsManagementModule />;
}
