"use client";

import moment from "moment";

import "moment/locale/vi";
import "moment/locale/fr";
import { useParams } from "next/navigation";

function MomentProvider({ children }: { children: React.ReactNode }) {
  const params = useParams();

  moment.locale(params?.locale as string);

  return <>{children}</>;
}

export default MomentProvider;
