"use client";

import { ModalData } from "@/components/core/common/ChangeAvatarModal";
import { useCallback, useState } from "react";

const useChangeAvatarModal = () => {
	const [data, setData] = useState<ModalData | undefined>();

	const open = useCallback((data: ModalData) => {
		setData(data);
	}, []);

	const close = useCallback(() => {
		setData(undefined);
	}, []);

	return { open, close, data };
};

export default useChangeAvatarModal;
