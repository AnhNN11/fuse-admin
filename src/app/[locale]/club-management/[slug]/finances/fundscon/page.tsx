import { Metadata } from "next";

export const metadata: Metadata = {
  title: "NEXTTEAM | Đóng phí",
};

import FinanceFundsConModule from "@/components/modules/Finances/FundsContribute";
import { redirect } from "next/navigation";
import axios from "axios";
import { endpointFinancessManagement } from "@/helpers/enpoints";


export default async function FundContributePage({params, searchParams}: any) {
  // const url = new URL(request.url);
  // const paid = url.searchParams.get("paid");

  console.log(`${process.env.NEXT_PUBLIC_API_SERVER}${endpointFinancessManagement.ADD_FUND}/${searchParams.paid}`)

  if(searchParams.paid == 'false')
    return redirect(`/${params?.locale}/club-management/${params?.slug}/finances/fundscon`)
  else if(searchParams.paid)
  {
    await axios.put(`${process.env.NEXT_PUBLIC_API_SERVER}${endpointFinancessManagement.ADD_FUND}/${searchParams.paid}`, {id: searchParams.paid, status: 'PAID'});
    return redirect(`/${params?.locale}/club-management/${params?.slug}/finances/fundscon`);
  }

  return <FinanceFundsConModule />;
}
