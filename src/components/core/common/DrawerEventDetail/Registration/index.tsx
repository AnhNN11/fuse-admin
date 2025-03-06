"use client";

import { Checkbox, Flex, Table } from "antd";

import * as S from "./styles";
import { useParams } from "next/navigation";
import { useTranslation } from "@/app/i18n/client";
import { useGetAllRegistrationsQuery } from "@/store/queries/eventsMangement";
import moment from "moment";

function Registration({ eventId }: { eventId: string }) {
  const params = useParams();

  const { t } = useTranslation(params?.locale as string, "eventsManagement");

  const { data, isFetching } = useGetAllRegistrationsQuery(eventId, {
    selectFromResult: ({ data, isFetching }) => {
      return {
        data: data?.result,
        isFetching,
      };
    },
  });
  console.log("🚀 ~ Registration ~ data:", data);

  const columns = [
    {
      title: t("registrationTable.order"),
      dataIndex: "order",
      key: "order",
      render: (text: string, record: any, index: number) => {
        return index + 1;
      },
    },
    {
      title: t("registrationTable.fullName"),
      dataIndex: "fullName",
      key: "fullName",
      render: (text: string, record: any, index: number) => {
        return `${record?.registeredBy?.firstname} ${record?.registeredBy?.lastname}`;
      },
    },
    {
      title: t("registrationTable.studentCode"),
      dataIndex: "studentCode",
      key: "studentCode",
      render: (text: string, record: any, index: number) => {
        return record?.registeredBy?.username;
      },
    },
    {
      title: t("registrationTable.email"),
      dataIndex: "email",
      key: "email",
      render: (text: string, record: any, index: number) => {
        return record?.registeredBy?.email;
      },
    },
    {
      title: t("registrationTable.phone"),
      dataIndex: "phone",
      key: "phone",
      render: (text: string, record: any, index: number) => {
        return record?.registeredBy?.phoneNumber;
      },
    },
    {
      title: t("registrationTable.created"),
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text: string, record: any, index: number) => {
        return moment(record?.createdAt).format("DD/MM/YYYY HH:mm");
      },
    },
    {
      title: t("registrationTable.isJoined"),
      dataIndex: "isJoined",
      key: "isJoined",
      render: (text: string, record: any, index: number) => {
        return (
          <Flex justify="center">
            <Checkbox checked={record?.isJoined} />
          </Flex>
        );
      },
      filters: [
        {
          text: "Đã điểm danh",
          value: true,
        },
        {
          text: "Chưa điểm danh",
          value: false,
        },
      ],
      onFilter: (value: any, record: any) => record?.isJoined === value,
    },
  ];

  return (
    <S.Wrapper>
      <Table loading={isFetching} columns={columns} dataSource={data} />
    </S.Wrapper>
  );
}

export default Registration;
