import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NEXTTEAM | Quản lý nhân sự",
};

import SemesterManagement from "@/components/modules/SemesterManagement";

export default function SemesterPage() {
  return <SemesterManagement />;
}
