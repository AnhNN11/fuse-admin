import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NEXTTEAM | Trang quản trị",
};

import BlogManagementModule from "@/components/modules/BlogManagement";

export default function DashboardPage() {
  return <BlogManagementModule />;
}
