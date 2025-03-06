import MemberListModule from "@/components/modules/HumanResources/MemberListComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NEXTTEAM | Danh sách thành viên",
};

export default function MemberListPage() {
  return <MemberListModule />;
}
