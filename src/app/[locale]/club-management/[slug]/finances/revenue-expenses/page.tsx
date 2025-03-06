import FinancesModule from "@/components/modules/Finances";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NEXTTEAM | Quản lý tài chính",
};

export default function REPage() {
  return <FinancesModule />;
}
