"use client";

import { Tag } from "antd";
import { useParams } from "next/navigation";

import { useTranslation } from "@/app/i18n/client";

function StatusEngagementTag({
  status,
}: {
  status: "NEW" | "REJECTED" | "MEMBER" | "DROP_OUT";
}) {
  const params = useParams();

  const { t } = useTranslation(params?.locale as string, "engagement");

  const statusColor = {
    NEW: "blue",
    REJECTED: "red",
    MEMBER: "green",
    DROP_OUT: "yellow",
  };

  return <Tag color={statusColor?.[status]}>{t(`statusFilter.${status}`)}</Tag>;
}

export default StatusEngagementTag;
