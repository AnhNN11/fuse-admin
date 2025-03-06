import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NEXTTEAM | Quản lý người dùng",
};

import MemberManagementModule from "@/components/modules/HumanResources/MemberManagement";

export default function UserManagementPage() {
  return <MemberManagementModule />;
}
