"use client";

import { ModalData } from "@/components/core/common/ConfirmModal";
import { useCallback, useState } from "react";

const useConfirmModal = () => {
	const [data, setData] = useState<ModalData | undefined>();

	const open = useCallback((data: ModalData) => {
		setData(data);
	}, []);

	const close = useCallback(() => {
		setData(undefined);
	}, []);

	return { open, close, data };
};

export default useConfirmModal;
