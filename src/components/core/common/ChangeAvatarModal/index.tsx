"use client";

import { Avatar, Button, Flex, message, Modal } from "antd";
import { useTranslation } from "@/app/i18n/client";
import React, { useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-toolkit";
import { themes } from "@/style/themes";
import Image from "next/image";
import { useUpdateAvatarMutation } from "@/store/queries/usersMangement";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "@/services/firebase/config";
import { v6 as uuidv6 } from "uuid";
import { updateUser } from "@/store/slices/auth";

export interface ModalData {
	id?: string;
	data: any;
	name: string;
	onOk: any;
	onCancel: any;
}

export interface ChangeAvatarModalProps {
	i18n?: string;
	data?: ModalData;
}

function ChangeAvatarModal({ data, i18n }: ChangeAvatarModalProps) {
	const params = useParams();
	const { t } = useTranslation(params?.locale as string, i18n);

	const { userInfo } = useAppSelector((state) => state.auth);
	const dispatch = useAppDispatch();

	const fileInputRef = useRef(null);
	const [uploadedImage, setUploadedImage] = useState<any>();
	const [updateAvatar] = useUpdateAvatarMutation();
	const handleOk = async (e: any) => {
		if (uploadedImage) {
			try {
				const storageRef = ref(storage, `imgs/${uuidv6()}`);
				const uploadTask = uploadBytesResumable(storageRef, uploadedImage);

				// Upload file
				await uploadTask;

				// Get download URL
				const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

				await updateAvatar({ _id: userInfo?._id, avatarUrl: downloadURL });

				dispatch(updateUser({ avatarUrl: downloadURL }));

				
				message.success("Avatar updated successfully!");

				data?.onOk();
			} catch (err) {
				console.log(err);
				message.error("Upload failed!");
			}
		}
	};
	const handleCancel = () => {
		data?.onCancel();
	};

	const handleImageUpload = (event: any) => {
		const file = event.target.files[0]; // Get the selected file
		if (file) {
			const imageUrl = URL.createObjectURL(file);
			file.imgUrl = imageUrl;
			setUploadedImage(file);
		}
	};

	const handleAvtClicked = () => {
		(fileInputRef.current as any)?.click(); // Programmatically click the file input
	};

	return (
		<Modal title={t(`modal.${data?.name ?? ""}.title`)} open={!!data} onOk={handleOk} onCancel={handleCancel}>
			<Flex vertical gap={20}>
				<input
					type="file"
					accept="image/*"
					style={{ display: "none" }} // Hide the input
					id="avatar-upload"
					onChange={handleImageUpload} // Handle the image upload
					ref={fileInputRef}
				/>

				<div style={{ textAlign: "center" }}>
					<Avatar
						style={{
							border: `2px solid ${themes?.default?.colors?.primary}`,
							cursor: "pointer",
						}}
						size={250}
						src={
							<Image
								src={uploadedImage?.imgUrl || userInfo?.avatarUrl}
								alt="avatar"
								width={500}
								height={500}
							/>
						}
					/>
				</div>
				<Button type="primary" onClick={handleAvtClicked}>
					Upload image
				</Button>
			</Flex>
		</Modal>
	);
}

export default ChangeAvatarModal;
