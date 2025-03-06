"use client";

import { Flex, Input, Pagination, Switch, Table, TableProps, Typography } from "antd";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import { SearchOutlined } from "@ant-design/icons";
import _ from "lodash";

import { useTranslation } from "@/app/i18n/client";
import { useGetAllUsersQuery, useUpdateUserMutation } from "@/store/queries/usersMangement";
import { createQueryString } from "@/utils/queryString";

import * as S from "./styles";
import UserInformationModal from "@/components/core/common/UserInformationModal";
import ConfirmModal from "@/components/core/common/ConfirmModal";
import useConfirmModal from "@/hooks/useConfirmModal";

interface DataType {
	key: string;
	_id: string;
	name: string;
	gender: string;
	phoneNumber: string;
	isActive: boolean;
	isAdmin: boolean;
}

interface UsersManagementProps {
	id?: string;
}

function UsersManagementModule({ id }: UsersManagementProps) {
	const params = useParams();
	const router = useRouter();
	const searchParams = useSearchParams();

	const page = Number(searchParams.get("page")) || 1;
	const search = searchParams.get("search") || "";

	const { t } = useTranslation(params?.locale as string, "usersManagement");
	const [updateUser, { isLoading }] = useUpdateUserMutation();
	const { open, close, data } = useConfirmModal();
	const { result, total, isFetching, refetch } = useGetAllUsersQuery(
		{
			page: page,
			page_size: 10,
			search: search,
		},
		{
			selectFromResult: ({ data, isFetching }) => {
				return {
					result: data?.result ?? [],
					total: data?.count ?? 0,
					isFetching,
				};
			},
		}
	);

	const onSwitchChange = (name: string, _id: string) => async (event: any) => {
		try {
			await updateUser({ [name]: event, _id }).unwrap();
			close();
			refetch();
		} catch (err) {
			console.error(err);
		}
	};

	const handleConfirmForm = (modalName: string, id: string, name: string) => (event: any) => {
		open({
			name: modalName,
			id,
			data: event,
			onOk: onSwitchChange(name, id),
			onCancel: close,
		});
	};

	const columns: TableProps<DataType>["columns"] = [
		{
			title: t("table.number"),
			dataIndex: "_id",
			key: "_id",
			width: 50,
			render: (text, _, index) => <Typography.Text>{index + 1}</Typography.Text>,
		},
		{
			title: t("table.name"),
			dataIndex: "name",
			key: "name",
			render: (text, _) => <Typography.Link href={`user-management/${_._id}`}>{(_ as any)?.firstname + " " + (_ as any)?.lastname}</Typography.Link>,
		},
		{
			title: t("Username"),
			dataIndex: "username",
			key: "username",
			render: (text, _) => <Typography.Text>{text}</Typography.Text>,
		},
		{
			title: t("table.gender"),
			dataIndex: "gender",
			key: "gender",
			width: 200,
			render: (text, _) => <Typography.Text>{t(`gender.${text}`)}</Typography.Text>,
		},
		{
			title: t("table.phoneNumber"),
			dataIndex: "phoneNumber",
			key: "phoneNumber",
			render: (text) => <Typography.Text>{text ?? "---"}</Typography.Text>,
		},
		{
			title: t("table.active"),
			dataIndex: "isActive",
			key: "isActive",
			render: (text, _) => (
				<Switch checked={text} onChange={handleConfirmForm("activeChange", _._id, "isActive")} loading={isLoading} />
			),
		},
		{
			title: t("table.admin"),
			dataIndex: "isAdmin",
			key: "isAdmin",
			render: (text, _) => (
				<Switch checked={text} onChange={handleConfirmForm("adminChange", _._id, "isAdmin")} loading={isLoading} />
			),
		},
	];
	if (id) {
		return <UserInformationModal _id={id} isEditModal={true} />;
	}

	const handlePageChange = (page: number) => {
		router.push(createQueryString("page", `${page}`));
	};

	const handleSearch = _.debounce((e: React.ChangeEvent<HTMLInputElement>) => {
		router.push(createQueryString("search", `${e?.target?.value}`));
	}, 300);

	return (
		<S.PageWrapper>
			<ConfirmModal data={data} i18n="usersManagement" />
			<S.Head>
				<Typography.Title level={2}>{t("title")}</Typography.Title>
			</S.Head>
			<S.FilterWrapper>
				<Typography.Title level={5}>{t("Search")}</Typography.Title>
				<Input placeholder="Search..." prefix={<SearchOutlined />} onChange={handleSearch} defaultValue={search} />
			</S.FilterWrapper>
			<S.TableWrapper>
				<Table
					columns={columns}
					dataSource={result}
					loading={isFetching}
					pagination={{pageSize: 10}}
					rowKey={(record) => record._id}
				/>
			</S.TableWrapper>
		</S.PageWrapper>
	);
}

export default UsersManagementModule;
