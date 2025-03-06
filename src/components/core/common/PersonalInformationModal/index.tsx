"use client";

import { Avatar, Button, Flex, Form, FormProps, Image, Input, Select, Spin, Typography } from "antd";
import * as S from "./styles";
import { useTranslation } from "@/app/i18n/client";
import { useGetUserQuery, useUpdateUserMutation } from "@/store/queries/usersMangement";
import { useParams } from "next/navigation";
import { LoadingOutlined, EditOutlined, CheckOutlined } from "@ant-design/icons";
import { createContext, useContext, useMemo, useState } from "react";
import ChangeAvatarModal from "../ChangeAvatarModal";
import { themes } from "@/style/themes";
import useChangeAvatarModal from "@/hooks/useChangeAvatarModal";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-toolkit";
import { updateUser } from "@/store/slices/auth";

export interface UserModalProps {
	_id: string;
	isEditModal: boolean;
}
const profileDefault = {
	avatar: "/images/profile/default-avatar.png",
	banner: "/images/profile/default-banner.png",
};

interface RowProps {
	name: string;
	value: any;
	disabled?: boolean;
	type?: string;
}

const dataContext = createContext<any>(undefined);

function DataRow(props: RowProps) {
	const { t, isEdit } = useContext(dataContext);
	
	if(props.type === 'gender') {
		const value = props.value.replaceAll('gender.', '');
		return (
			<tr>
				<S.UnTD>{t(`data.${props.name}`)}</S.UnTD>
				<td>
					<Form.Item name={props.name} initialValue={value}>
						<Select 
							variant={props.disabled ? "filled" : isEdit ? "outlined" : "filled"}
							disabled={!isEdit}
						>
							<Select.Option value={'male'}>{t(`data.male`)}</Select.Option>
							<Select.Option value={'fermale'}>{t(`data.female`)}</Select.Option>
						</Select>
					</Form.Item>
				</td>
			</tr>
		)
	}
	return (
		<tr>
			<S.UnTD>{t(`data.${props.name}`)}</S.UnTD>
			<td>
				<Form.Item name={props.name} initialValue={props.value}>
					<Input
						variant={props.disabled ? "filled" : isEdit ? "outlined" : "filled"}
						readOnly={!isEdit}
						type={props.type}
					/>
				</Form.Item>
			</td>
		</tr>
	);
}

function DataTable({ children }: any) {
	return (
		<S.DataTable>
			<tbody>{children}</tbody>
		</S.DataTable>
	);
}

function PersonalInformationModal(props: UserModalProps) {
	const params = useParams();
	const [isEdit, setEdit] = useState(false);
	const [updateUser_, userState] = useUpdateUserMutation();
	const [form] = Form.useForm();
	const { t } = useTranslation(params?.locale as string, "usersManagement");
	const { data, isLoading, isSuccess, refetch } = useGetUserQuery({
		id: props._id,
	});
	const dispatch = useAppDispatch();
	const context = useMemo(
		() => ({
			t,
			result: data?.result,
			isEdit,
		}),
		[data?.result, isEdit, t]
	);

	const { userInfo } = useAppSelector((state) => state.auth);
	const changeAvatarModal = useChangeAvatarModal();

	const result = data?.result;

	const submitForm = () => {
		setEdit(!isEdit);
		if (isEdit) {
			form.submit();
		}
	};

	const onFinish: FormProps["onFinish"] = async (values) => {
		values = { ...values, _id: props._id };
		try {
			await updateUser_(values).unwrap();
			dispatch(updateUser({ firstname: values.firstname, lastname: values.lastname, email: values.email }));
			refetch();
		} catch (err) {
			console.error(err);
		}
	};
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

	return (
		<dataContext.Provider value={context}>
			{isLoading && (
				<Spin
					style={{ margin: "auto", width: "fit-content" }}
					indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
				/>
			)}
			{isSuccess && (
				<Form autoComplete="off" form={form} onFinish={onFinish}>
					<S.Scrollable>
						<div className="profile-header">
							<S.BannerWrapper>
								<S.UserImage
									src={result?.bannerUrl ?? profileDefault.banner}
									alt=""
									width="100%"
									height={300}
									preview={{ mask: false }}
								/>
								<div
									style={{
										width: "100%",
										height: 300,
										marginTop: "-300px",
										backgroundImage:
											"linear-gradient(to bottom, transparent 0%, transparent 85%, white 100%)",
										transform: "translateZ(9px)",
										pointerEvents: "none",
									}}
								></div>
							</S.BannerWrapper>
							<S.BaseInfoWrapper>
								<ChangeAvatarModal data={changeAvatarModal.data} i18n="usersManagement" />
								<Flex vertical={false}>
									<Flex gap={10} align="center" justify="center">
										<Avatar
											style={{
												border: `2px solid ${themes?.default?.colors?.primary}`,
												cursor: "pointer",
											}}
											size={150}
											src={<Image src={userInfo?.avatarUrl} alt="avatar" width={150} height={150} preview={false} />}
											onClick={handleAvtClicked}
										/>
									</Flex>
								</Flex>
								<S.NameWrapper>
									{isEdit ? (
										<div>
											<Form.Item
												style={{ display: "inline-block" }}
												name="firstname"
												initialValue={result?.firstname}
											>
												<Input placeholder="First name" />
											</Form.Item>
											<Form.Item
												style={{ display: "inline-block" }}
												name="lastname"
												initialValue={result?.lastname}
											>
												<Input placeholder="Last name" />
											</Form.Item>
										</div>
									) : (
										<Typography.Title>{`${result?.firstname} ${result?.lastname}`}</Typography.Title>
									)}

									<Typography.Text color="#bbb">{result?.username}</Typography.Text>
								</S.NameWrapper>
								{props.isEditModal && (
									<Button
										type="primary"
										shape="circle"
										style={{ marginLeft: 20 }}
										icon={
											!userState.isLoading ? (
												!isEdit ? (
													<EditOutlined />
												) : (
													<CheckOutlined />
												)
											) : (
												<Spin
													style={{ margin: "auto", width: "fit-content" }}
													indicator={
														<LoadingOutlined style={{ fontSize: 24, color: "white" }} spin />
													}
												/>
											)
										}
										onClick={submitForm}
									/>
								)}
							</S.BaseInfoWrapper>
						</div>
						<S.ProfileBody>
							<S.SectionTitle>Thông tin cơ bản</S.SectionTitle>
							<DataTable>
								<DataRow name="email" value={result?.email} />
								<DataRow name="phoneNumber" value={result?.phoneNumber} />
								<DataRow name="gender" value={t(`gender.${result?.gender}`)} type="gender" />
								<DataRow name="dob" value={result?.dob?.split("T")?.[0]} type="date" />
								<DataRow name="homeTown" value={result?.homeTown} />
							</DataTable>
							<S.SectionTitle>Thông tin chuyên ngành</S.SectionTitle>
							<DataTable>
								<DataRow name="major" value={result?.major} />
								<DataRow name="academicYear" value={result?.academicYear} />
							</DataTable>
							<S.SectionTitle>Thông tin liên hệ khác</S.SectionTitle>
							<DataTable>
								<DataRow name="facebookUrl" value={result?.facebookUrl} />
								<DataRow name="linkedInUrl" value={result?.linkedInUrl} />
							</DataTable>
						</S.ProfileBody>
					</S.Scrollable>
				</Form>
			)}
		</dataContext.Provider>
	);
}

export default PersonalInformationModal;
