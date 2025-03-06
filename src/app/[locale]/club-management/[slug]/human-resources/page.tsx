import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NEXTTEAM | Quản lý nhân sự",
};

import HumanResourcesModule from "@/components/modules/HumanResources";

export default function HumanResourcesPage() {
  return <HumanResourcesModule />;
}
