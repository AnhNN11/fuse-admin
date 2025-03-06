"use client";

import {
  redirect,
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import * as S from "./styles";
import { useTranslation } from "@/app/i18n/client";
import {
  Button,
  Flex,
  Form,
  Input,
  message,
  Pagination,
  Select,
  Table,
  TableProps,
  Tag,
  Typography,
} from "antd";
import ConfirmModal from "@/components/core/common/ConfirmModal";
import { SearchOutlined } from "@ant-design/icons";
import { createQueryString } from "@/utils/queryString";
import _ from "lodash";
import {
  useGetUserFundMutation,
  usePayFundMutation,
  usePayMutation,
} from "@/store/queries/finances";
import { useGetClubBySubnameQuery } from "@/store/queries/clubManagement";
import React, { useCallback, useEffect, useState } from "react";
import useConfirmModal from "@/hooks/useConfirmModal";
import { useGetCurrentEngagementMutation } from "@/store/queries/engagementManagement";
import { useCookies } from "react-cookie";

interface DataType {
  _id: string;
  title: string;
  content: string;
  creator: string;
  amount: number;
  type: string;
}

function FinancesConModule() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const type = searchParams.get("type") || undefined;

  const { t } = useTranslation(params?.locale as string, "finances");

  const [cookies] = useCookies(["_user_info", "_current_club"]);
  const [getAllFinances, { isLoading }] = useGetUserFundMutation();
  const [finances, setFinances] = useState<any>();
  const [open, setOpen] = useState<boolean>(false);
  const [getCurrentEngagement] = useGetCurrentEngagementMutation();
  const [currEng, setCurrentEng] = useState<any>();
  const [pay] = usePayMutation();
  const [payFund] = usePayFundMutation();

  useEffect(() => {
    (async () => {
      const currEng = await getCurrentEngagement({
        userId: cookies["_user_info"]._id,
        clubId: cookies._current_club,
      }).unwrap();
      setCurrentEng(currEng.result);
    })();
  }, [cookies, getCurrentEngagement]);

  const refetch = useCallback(
    async (clubId: any) => {
      if (!clubId || !currEng._id) return;
      const fin = await getAllFinances({
        id: currEng._id,
      }).unwrap();
      setFinances(fin);
    },
    [currEng, getAllFinances]
  );

  useEffect(() => {
    if (currEng?._id) refetch(currEng._id);
  }, [currEng, cookies._current_club, refetch]);
  const confirmModal = useConfirmModal();

  const columns: TableProps<DataType>["columns"] = [
    {
      title: t("table.number"),
      dataIndex: "_id",
      key: "_id",
      width: 50,
      render: (text, _, index) => (
        <Typography.Text>{5 * (page - 1) + index + 1}</Typography.Text>
      ),
    },
    {
      title: t("table.title"),
      dataIndex: "title",
      key: "title",
      render: (text, _) => <Typography.Text>{text}</Typography.Text>,
    },
    {
      title: t("table.content"),
      dataIndex: "content",
      key: "content",
      render: (text, _) => <Typography.Text>{text}</Typography.Text>,
    },
    {
      title: t("table.creator"),
      dataIndex: "creator",
      key: "creator",
      render: (text) => (
        <Typography.Text>
          {text?.length ? text?.[0]?.firstname : t("admin")}
        </Typography.Text>
      ),
    },
    {
      title: t("table.amount"),
      dataIndex: "amount",
      key: "amount",
      render: (text, _) => (
        <Typography.Text style={{ color: _.type === "r" ? "#3c3" : "#c33" }}>
          {Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(text)}
        </Typography.Text>
      ),
    },
    {
      title: t("table.action"),
      dataIndex: "_id",
      key: "action",
      render: (text, _) => (
        <Button
          type="primary"
          disabled={(_ as any).status != "NOT_PAID"}
          onClick={async () => {
            const a = (
              await pay({
                amount: _.amount,
                lang: params?.locale as string,
                clb: params?.slug as string,
                eng: _._id,
                msg: _.title,
              }).unwrap()
            ).checkoutUrl;
            router.push(a);
          }}
        >
          {t("conFunds")}
        </Button>
      ),
    },
  ];

  const handlePageChange = (page: number) => {
    router.push(createQueryString("page", `${page}`));
  };

  const handleSearch = _.debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    router.push(createQueryString("search", `${e?.target?.value}`));
  }, 300);

  const handleType = _.debounce((e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(createQueryString("type", `${e}`));
  }, 300);

  return cookies._current_club ? (
    <S.PageWrapper>
      <ConfirmModal i18n="finances" data={confirmModal.data} />

      <S.Head style={{ display: "block" }}>
        <Typography.Title level={2}>{t("confund")}</Typography.Title>
      </S.Head>
      <S.FilterWrapper>
        <Form style={{ display: "flex", justifyContent: "space-between" }}>
          <Form.Item>
            <Input
              placeholder={t("search")}
              prefix={<SearchOutlined />}
              onChange={handleSearch}
              defaultValue={search}
              style={{ width: 300, marginRight: 15 }}
            />
          </Form.Item>
          <Form.Item>
            <Select
              defaultValue={(type ?? "") as any}
              options={[
                { value: "", label: <span>{t("none")}</span> },
                { value: "r", label: <span>{t("revenue")}</span> },
                { value: "e", label: <span>{t("expense")}</span> },
              ]}
              onChange={handleType}
              style={{ width: 150 }}
            />
          </Form.Item>
        </Form>
      </S.FilterWrapper>
      <S.TableWrapper>
        <Table
          columns={columns}
          dataSource={finances ?? []}
          loading={isLoading}
          pagination={{pageSize: 5}}
          onChange={(evt) => router.push(createQueryString('page', `${evt.current}`))}
          rowKey={(record) => record._id}
        />
      </S.TableWrapper>
    </S.PageWrapper>
  ) : (
    <></>
  );
}

export default FinancesConModule;
