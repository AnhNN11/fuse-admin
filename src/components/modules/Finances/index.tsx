"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import * as S from "./styles";
import { useTranslation } from "@/app/i18n/client";
import {
  Button,
  Flex,
  Form,
  Input,
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
import { useGetAllFinancesMutation } from "@/store/queries/finances";
import { useGetClubBySubnameQuery } from "@/store/queries/clubManagement";
import React, { useCallback, useEffect, useState } from "react";
import AddExpense from "@/components/core/common/AddExpense";
import useConfirmModal from "@/hooks/useConfirmModal";
import AddFunds from "@/components/core/common/AddFund";
import AddRevenue from "@/components/core/common/AddRevenue";
import { useCookies } from "react-cookie";

interface DataType {
  _id: string;
  title: string;
  content: string;
  creator: string;
  amount: number;
  type: string;
}

function FinancesModule() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const type = searchParams.get("type") || undefined;
  const [cookies] = useCookies(["_user_info", "_current_club"]);

  const { t } = useTranslation(params?.locale as string, "finances");

  const [getAllFinances, { isLoading }] = useGetAllFinancesMutation();
  const [finances, setFinances] = useState<any>();
  const [open, setOpen] = useState<boolean>(false);
  const [open1, setOpen1] = useState<boolean>(false);

  const refetch = useCallback(
    async (clubId: any) => {
      if (!clubId) return;
      const fin = await getAllFinances({
        clubId,
        page,
        page_size: 10,
        search,
        type,
      }).unwrap();
      setFinances(fin);
    },
    [getAllFinances, page, search, type]
  );

  useEffect(() => {
    if (cookies._current_club) refetch(cookies._current_club);
  }, [cookies._current_club, refetch]);
  const confirmModal = useConfirmModal();

  const columns: TableProps<DataType>["columns"] = [
    {
      title: "",
      dataIndex: "type",
      key: "type",
      width: 50,
      render: (text, _, index) => (
        // <S.CircleArrow style={{ backgroundColor: text === "r" ? "#cfc" : "#fcc" }}>
        // 	{text === "r" ? <CaretUpFilled color="#7f7" /> : <CaretDownFilled color="#f77" />}
        // </S.CircleArrow>
        <Tag color={text == "r" ? "green" : "red"}>{t(text)}</Tag>
      ),
    },
    {
      title: t("table.number"),
      dataIndex: "_id",
      key: "_id",
      width: 50,
      render: (text, _, index) => (
        <Typography.Text>{10 * (page - 1) + index + 1}</Typography.Text>
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
          {text.length ? text?.[0]?.firstname : t("admin")}
        </Typography.Text>
      ),
    },
    {
      title: t("table.amount"),
      dataIndex: "amount",
      key: "amount",
      render: (text, _) => (
        <Typography.Text style={{ color: _.type === "r" ? "#3c3" : "#c33" }}>
          {_.type === "r" ? "+" : "-"}{" "}
          {Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(text)}
        </Typography.Text>
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
      <AddExpense
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
        footer={[]}
        t={t}
        clubId={cookies._current_club}
        setOpen={setOpen}
        refetch={refetch}
        confirmModal={confirmModal}
        balance={finances?.balance}
      />
      <AddRevenue
        open={open1}
        onCancel={() => {
          setOpen1(false);
        }}
        footer={[]}
        t={t}
        clubId={cookies._current_club}
        setOpen={setOpen1}
        refetch={refetch}
        confirmModal={confirmModal}
        balance={finances?.balance}
      />
      <S.Head style={{ display: "block" }}>
        <Typography.Title level={2}>{t("title")}</Typography.Title>
        <Typography.Title level={4}>
          {t("balance")}:{" "}
          {Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(finances?.balance)}
        </Typography.Title>
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
      <Flex justify="flex-end" style={{ margin: "10px 0", gap: "10px" }}>
        <Button
          type="primary"
          onClick={() => {
            setOpen1(true);
          }}
        >
          {t("addRevenue")}
        </Button>
        <Button
          type="primary"
          onClick={() => {
            setOpen(true);
          }}
        >
          {t("addExpenses")}
        </Button>
      </Flex>
      <S.TableWrapper>
        <Table
          columns={columns}
          dataSource={finances?.result ?? []}
          loading={isLoading}
          pagination={false}
          rowKey={(record) => record._id}
        />
      </S.TableWrapper>
      <Flex justify="flex-end">
        <Pagination
          defaultCurrent={page}
          total={finances?.total}
          onChange={handlePageChange}
          pageSize={10}
        />
      </Flex>
    </S.PageWrapper>
  ) : (
    <></>
  );
}

export default FinancesModule;
