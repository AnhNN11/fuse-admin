"use client";

import { Tag } from "antd";
import { useParams } from "next/navigation";

import { useTranslation } from "@/app/i18n/client";

function StatusInterviewTag({
  status,
}: {
  status:
    | "NEW"
    | "SENT_INTERVIEW"
    | "INTERVIEWED"
    | "APPROVED"
    | "REJECTED"
    | "CANCELED";
}) {
  const params = useParams();

  const { t } = useTranslation(params?.locale as string, "engagement");

  const statusColor = {
    NEW: "blue",
    SENT_INTERVIEW: "yellow",
    INTERVIEWED: "purple",
    APPROVED: "green",
    REJECTED: "red",
    CANCELED: "red",
  };

  return (
    <Tag color={statusColor?.[status]}>
      {t(`interviewStatusFilter.${status}`)}
    </Tag>
  );
}

export default StatusInterviewTag;
