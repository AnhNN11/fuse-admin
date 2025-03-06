"use client";

import { Tag } from "antd";
import { useParams } from "next/navigation";

import { useTranslation } from "@/app/i18n/client";

function EventTypeTag({ type }: { type: "INTERNAL" | "PUBLIC" }) {
  const params = useParams();

  const { t } = useTranslation(params?.locale as string, "common");

  const typeColor = {
    INTERNAL: "magenta",
    PUBLIC: "cyan",
  };

  return (
    <Tag color={typeColor?.[type]}>
      {t(`eventTypes.${type?.toLowerCase()}`)}
    </Tag>
  );
}

export default EventTypeTag;
