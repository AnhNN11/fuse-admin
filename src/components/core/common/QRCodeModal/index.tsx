import { Flex, Modal, QRCode } from "antd";

import { useGetEventByIdQuery } from "@/store/queries/eventsMangement";

import Typography from "../Typography";

function QRCodeModal({
  open = true,
  onClose = () => {},
  eventId = "",
}: {
  open: boolean;
  onClose: () => void;
  eventId?: string;
}) {
  const { data } = useGetEventByIdQuery(eventId, {
    selectFromResult: ({ data, isFetching }) => {
      return {
        data: data?.result,
        isFetching,
      };
    },
    skip: !eventId,
  });
  return (
    <Modal open={open} footer={[]} onCancel={onClose}>
      <Flex
        vertical
        align="center"
        style={{
          marginBottom: 24,
        }}
      >
        <Typography.Title level={4} $align="center">
          Điểm danh sự kiện
        </Typography.Title>
        <Typography.Text $align="center">
          Quét mã QR hoặc sử dụng mã dưới đây để điểm danh nhé!
        </Typography.Text>
      </Flex>
      <Flex vertical align="center">
        <QRCode
          value={data?.checkInCode}
          style={{
            marginBottom: 16,
          }}
        />
        <Flex gap={12} align="flex-end">
          <Typography.Text $align="center">Mã điểm danh:</Typography.Text>
          <Typography.Title level={4} $align="center">
            {data?.checkInCode}
          </Typography.Title>
        </Flex>
      </Flex>
    </Modal>
  );
}

export default QRCodeModal;
