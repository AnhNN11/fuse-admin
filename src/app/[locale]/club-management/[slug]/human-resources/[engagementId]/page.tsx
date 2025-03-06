import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NEXTTEAM | Quản lý nhân sự",
};

import InterviewInfoModule from "@/components/modules/HumanResources/InterviewInfoContainer";

export default function HumanResourcesPage() {
  return <InterviewInfoModule />;
}
