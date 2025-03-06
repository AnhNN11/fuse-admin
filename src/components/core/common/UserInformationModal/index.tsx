"use client";

import { Button, Form, FormProps, Input, Spin, Typography } from "antd";
import * as S from "./styles";
import { useTranslation } from "@/app/i18n/client";
import {
  useGetUserQuery,
  useUpdateUserMutation,
} from "@/store/queries/usersMangement";
import { useParams } from "next/navigation";
import {
  LoadingOutlined,
  EditOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { createContext, useContext, useMemo, useState } from "react";
import moment from "moment";

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

function UserInformationModal(props: UserModalProps) {
  const params = useParams();
  const [isEdit, setEdit] = useState(false);
  const [updateUser, userState] = useUpdateUserMutation();
  const [form] = Form.useForm();
  const { t } = useTranslation(params?.locale as string, "usersManagement");
  const { data, isLoading, isSuccess, refetch } = useGetUserQuery({
    id: props._id,
  });
  const context = useMemo(
    () => ({
      t,
      result: data?.result,
      isEdit,
    }),
    [data?.result, isEdit, t]
  );
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
      await updateUser(values).unwrap();
      refetch();
    } catch (err) {
      console.error(err);
    }
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
                <S.AvatarWrapper>
                  <S.UserImage
                    src={result?.avatarUrl ?? profileDefault.avatar}
                    alt=""
                    width={175}
                    height={175}
                    style={{ borderRadius: "50%" }}
                    preview={{ mask: false }}
                  />
                </S.AvatarWrapper>
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

                  {isEdit ? (
                    <Form.Item
                      style={{ display: "inline-block", marginBottom: "0" }}
                      name="username"
                      initialValue={result?.username}
                    >
                      <Input placeholder="Username" />
                    </Form.Item>
                  ) : (
                    <Typography.Text color="#bbb">
                      {result?.username}
                    </Typography.Text>
                  )}
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
                            <LoadingOutlined
                              style={{ fontSize: 24, color: "white" }}
                              spin
                            />
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
                <DataRow name="gender" value={t(`gender.${result?.gender}`)} />
                <DataRow
                  name="dob"
                  value={result?.dob?.split("T")?.[0]}
                  type="date"
                />
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
              <S.SectionTitle>Thông tin cho quản trị</S.SectionTitle>
              <DataTable>
                <DataRow
                  name="createdAt"
                  value={moment(result?.createdAt).format("DD/MM/YYYY HH:mm")}
                  disabled
                />
                <DataRow
                  name="updatedAt"
                  value={moment(result?.updatedAt).format("DD/MM/YYYY HH:mm")}
                  disabled
                />
              </DataTable>
            </S.ProfileBody>
          </S.Scrollable>
        </Form>
      )}
    </dataContext.Provider>
  );
}

export default UserInformationModal;
