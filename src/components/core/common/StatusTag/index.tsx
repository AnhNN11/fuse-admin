"use client";

import { Tag } from "antd";
import { useParams } from "next/navigation";

import { useTranslation } from "@/app/i18n/client";

function StatusTag({
  status,
}: {
  status: "PENDING" | "APPROVED" | "REJECTED";
}) {
  const params = useParams();

  const { t } = useTranslation(params?.locale as string, "common");

  const statusColor = {
    PENDING: "yellow",
    APPROVED: "green",
    REJECTED: "red",
  };

  return (
    <Tag color={statusColor?.[status]}>
      {t(`eventStatus.${status?.toLowerCase()}`)}
    </Tag>
  );
}

export default StatusTag;
