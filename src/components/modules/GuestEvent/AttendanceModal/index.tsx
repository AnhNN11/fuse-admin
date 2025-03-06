import Button from "@/components/core/common/Button";
import { useTakeAttendanceMutation } from "@/store/queries/eventsMangement";
import { Form, Input, Modal, QRCode, Tabs, TabsProps, message } from "antd";

function AttendanceModal({
  open = true,
  onClose = () => {},
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [takeAttendance, { isLoading }] = useTakeAttendanceMutation();
  const onFinish = async (values: any) => {
    console.log(values);
    try {
      await takeAttendance({ checkInCode: values.checkInCode }).unwrap();
      message.success("Điểm danh thành công");
      onClose();
    } catch (error: any) {
      console.log("🚀 ~ onFinish ~ error:", error);
      message.error(error?.data?.message);
    }
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Sử dụng mã",
      children: (
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Mã sự kiện"
            required
            name={"checkInCode"}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mã sự kiện",
              },
            ]}
          >
            <Input placeholder="Nhập mã sự kiện" />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Điểm danh
          </Button>
        </Form>
      ),
    },
    {
      key: "2",
      label: "Quét mã QR",
      children: <></>,
    },
  ];
  return (
    <Modal open={open} title="Điểm danh sự kiện" footer={[]} onCancel={onClose}>
      <Tabs defaultActiveKey="1" items={items}></Tabs>
    </Modal>
  );
}

export default AttendanceModal;
