"use client";

import Image from "next/image";
import { Avatar, Divider, Flex, Form, Input } from "antd";
import { useRouter } from "next-nprogress-bar";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";

import * as S from "./styles";
import { useAppSelector } from "@/hooks/redux-toolkit";
import ChangeAvatarModal from "@/components/core/common/ChangeAvatarModal";
import useChangeAvatarModal from "@/hooks/useChangeAvatarModal";
import { themes } from "@/style/themes";
import { useGetUser_Mutation, useGetUserQuery } from "@/store/queries/usersMangement";
import { useCallback, useEffect, useState } from "react";
import { log } from "console";
import UserInformationModal from "@/components/core/common/UserInformationModal";
import PersonalInformationModal from "@/components/core/common/PersonalInformationModal";

type FieldType = {
	firstname: string;
	lastname: string;
	email: string;
	gender: string;
	password: string;
	username: string;
	passwordConfirm: string;
	phoneNumber: string;
};
function detachName(fullName: string | undefined): {
	firstname: string;
	lastname: string;
} {
	if (!fullName) {
		return { firstname: "", lastname: "" };
	}
	const parts = fullName.trim().split(/\s+/); // Improved to handle multiple spaces
	const firstname = parts.shift() || ""; // Safely extract the first part
	const lastname = parts.join(" "); // Join the remaining parts
	return { firstname, lastname };
}

function EditProfileModule() {
	const { userInfo } = useAppSelector((state) => state.auth);
	const [getUser, { isSuccess }] = useGetUser_Mutation();
	const [user, setUser] = useState<any>();

	const changeAvatarModal = useChangeAvatarModal();

	const updateUser = useCallback(async () => {
		if (userInfo) {
			const userr = await getUser({ id: userInfo._id });
			setUser(userr.data.result);
		}
	}, [getUser, userInfo]);

	useEffect(() => {
		updateUser();
	}, [updateUser, userInfo]);
	// useEffect(() => {
	// 	console.log("user: ", user);
	// }, [user]);

	const handleAvtClicked = () => {
		changeAvatarModal.open({
			data: changeAvatarModal.data,
			name: "changeAvt",
			onOk: () => {
				console.log("ok");
				changeAvatarModal.close();
			},
			onCancel: () => {
				console.log("cancel");
				changeAvatarModal.close();
			},
		});
	};

	console.log("user----", user);

	return (
		<S.Wrapper>
			<PersonalInformationModal _id={user?._id} isEditModal={true} />
		</S.Wrapper>
	);
}

export default EditProfileModule;
