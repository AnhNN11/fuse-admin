import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NEXTTEAM | Quản lý th",
};

import NotificationDetail from "@/components/modules/NotificationDetail";

export default function UserManagementPage() {
  return <NotificationDetail />;
}
