import { CloseOutlined } from "@ant-design/icons";
import { Flex, Tabs, TabsProps } from "antd";
import { useParams } from "next/navigation";

import themeColors from "@/style/themes/default/colors";
import { useTranslation } from "@/app/i18n/client";

import Typography from "../../Typography";
import Overview from "../Overview";

import * as S from "./styles";

function DrawerMeetingDetail({
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
            Tạo cuộc họp
          </Typography.Title>
        </Flex>
      }
      placement="bottom"
      closable={false}
      onClose={onClose}
      open={open}
      height={"calc(100vh - 300px)"}
    >
      <Overview
        eventId={eventId}
        type={type}
        onClose={onClose}
        refetch={refetch}
        clubId={clubId}
      />
    </S.DrawerCustom>
  );
}

export default DrawerMeetingDetail;
