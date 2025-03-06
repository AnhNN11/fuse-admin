"use client";

import { Flex } from "antd";

import useModal from "@/hooks/useModal";

import Button from "@/components/core/common/Button";
import Typography from "@/components/core/common/Typography";

import AttendanceModal from "./AttendanceModal";
import AllEventList from "../EventsManagement/AllEventList";

function GuestEvent() {
  const modal = useModal();

  return (
    <div
      style={{
        minHeight: "100vh",
        maxWidth: 1440,
        margin: "0 auto",
        padding: "0 80px",
      }}
    >
      <Flex justify="space-between" align="center">
        <Typography.Title level={2} $margin="40px 0">
          Sự kiện đang diễn ra
        </Typography.Title>
        <Button type="primary" onClick={modal.open}>
          Điểm danh
        </Button>
      </Flex>
      <AttendanceModal open={modal.visible} onClose={modal.close} />
      <AllEventList />
    </div>
  );
}

export default GuestEvent;
