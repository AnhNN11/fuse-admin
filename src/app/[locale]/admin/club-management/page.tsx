import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quản lí câu lạc bộ",
};

import ClubsManagementModule from "@/components/modules/ClubsManagement";

export default function UserManagementPage() {
  return <ClubsManagementModule />;
}
