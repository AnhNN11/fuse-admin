import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NEXTTEAM | Trang quản trị",
};

import DashboardManagerModule from "@/components/modules/DashboardManager";
export default function DashboardPage() {
  return <DashboardManagerModule />;
}
