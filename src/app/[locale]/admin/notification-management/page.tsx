import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lí thông báo",
};

import NotificationsAdminManagement from "@/components/modules/NotificationsAdminManagement";

export default function UserManagementPage() {
  return <NotificationsAdminManagement />;
}
