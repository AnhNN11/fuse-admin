"use client";

import { Modal } from "antd";
import { useTranslation } from "@/app/i18n/client";
import React from "react";
import { useParams } from "next/navigation";

export interface ModalData {
  id?: string;
  data: any;
  name: string;
  onOk: any;
  onCancel: any;
}

export interface ConfirmModalProps {
  i18n: string;
  data?: ModalData;
}

function ConfirmModal({ data, i18n }: ConfirmModalProps) {
  const params = useParams();
  const { t } = useTranslation(params?.locale as string, i18n);
  const handleOk = (e: any) => {
    data?.onOk(data.data);
  };
  const handleCancel = () => {
    data?.onCancel();
  };
  return (
    <Modal
      title={t(`modal.${data?.name ?? ""}.title`)}
      open={!!data}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <p>{t(`modal.${data?.name ?? ""}.content`)}</p>
    </Modal>
  );
}

export default ConfirmModal;
