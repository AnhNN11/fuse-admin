import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NEXTTEAM | Quản lý tài chính",
};

import FinanceFundsModule from "@/components/modules/Finances/Funds";

export default function FundPage() {
  return <FinanceFundsModule />;
}
