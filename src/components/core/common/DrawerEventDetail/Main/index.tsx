import { CloseOutlined } from "@ant-design/icons";
import { Flex, Tabs, TabsProps } from "antd";
import { useParams } from "next/navigation";

import themeColors from "@/style/themes/default/colors";
import { useTranslation } from "@/app/i18n/client";

import Typography from "../../Typography";
import Overview from "../Overview";
import Registration from "../Registration";
import Feedback from "../Feedback";

import * as S from "./styles";

function DrawerEventDetail({
  open = true,
  onClose = () => {},
  eventId = "",
  type = "READ",
  refetch,
  clubId,
}: {
  open: boolean;
  onClose: () => void;
  eventId?: string;
  type: "READ" | "EDIT" | "CREATE";
  refetch: () => void;
  clubId?: string;
}) {
  const params = useParams();

  const { t } = useTranslation(params?.locale as string, "eventsManagement");

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: t("eventDetail.tabs.overview"),
      children: (
        <Overview
          eventId={eventId}
          type={type}
          onClose={onClose}
          refetch={refetch}
          clubId={clubId}
        />
      ),
    },
    {
      key: "2",
      label: t("eventDetail.tabs.registrations"),
      children: <Registration eventId={eventId} />,
    },
    {
      key: "3",
      label: t("eventDetail.tabs.feedbacks"),
      children: <Feedback />,
    },
  ];

  return (
    <S.DrawerCustom
      title={
        <Flex gap={8} align="center">
          <CloseOutlined onClick={onClose} />
          <Typography.Title
            level={4}
            $fontWeight={300}
            $color={themeColors.textWhite}
          >
            {type === "CREATE" ? t("create") : t("eventDetail.title")}
          </Typography.Title>
        </Flex>
      }
      placement="bottom"
      closable={false}
      onClose={onClose}
      open={open}
      height={"calc(100vh - 72px)"}
    >
      <Tabs
        defaultActiveKey="1"
        items={type !== "CREATE" ? items : [items?.[0]]}
      />
    </S.DrawerCustom>
  );
}

export default DrawerEventDetail;
