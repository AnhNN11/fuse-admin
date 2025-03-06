"use client";

import React, {
  useCallback,
  useLayoutEffect,
  useState,
  useEffect,
} from "react";
import Avatar from "react-avatar";
import Image from "next/image";
import {
  MenuFoldOutlined,
  BellOutlined,
  ExportOutlined,
  MoreOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { Flex, Layout, Menu, Popover, message } from "antd";
import { Button, notification, List, Switch, Space } from "antd";
import { useParams, usePathname } from "next/navigation";
import { AppProgressBar, useRouter } from "next-nprogress-bar";
import { useLocale } from "next-intl";
import { useAppSelector } from "@/hooks/redux-toolkit";
import DropdownMenu from "./DropdownMenu";
import SelectLanguage from "./SelectLanguage";
import Typography from "../../common/Typography";
import LoadingScreen from "../../common/LoadingScreen";
import { clubSidebarMenu } from "@/helpers/data/sidebarMenu";
import { useTranslation } from "@/app/i18n/client";
import { themes } from "@/style/themes";
import {
  useCheckIsMemberMutation,
  useVerifyTokenMutation,
} from "@/store/queries/auth";
import webStorageClient from "@/utils/webStorageClient";
import { getRootPathname } from "@/utils/getPathname";
import themeColors from "@/style/themes/default/colors";
import { actionAccessClub } from "@/store/slices/auth";
import { useAppDispatch } from "@/hooks/redux-toolkit";
import {
  useGetAllNotificationByUserIdQuery,
  useMarkNotificationAsReadMutation,
} from "@/store/queries/notificationManagement";
import * as S from "./styles";
import moment from "moment";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: string;
  type: string;
  isReadByUser: boolean;
}

const ClubLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const params = useParams();
  const router = useRouter();
  const localActive = useLocale();
  const pathname = usePathname();

  const { t } = useTranslation(params?.locale as string, "layout");
  const { slug } = useParams<{ slug: string }>();

  const dispatch = useAppDispatch();

  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [isShowMenu, setIsShowMenu] = useState<boolean>(false);
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [role, setRole] = useState<"Admin" | "Manager" | "Member">("Member");

  const [verifyToken] = useVerifyTokenMutation();

  const { userInfo } = useAppSelector((state) => state.auth);

  const [checkIsMember, { isLoading, error }] = useCheckIsMemberMutation();

  // const {
  //   result: clubsResult,
  //   isFetching,
  //   error,
  // } = useGetClubBySubnameQuery(
  //   {
  //     subname: slug?.toUpperCase() as string,
  //   },
  //   {
  //     selectFromResult: ({ data, isFetching, error }) => {
  //       return {
  //         result: {
  //           ...data?.clubInfo,
  //           event: data?.eventByClub.events ?? [],
  //         } as ClubDataType,
  //         total: data?.count ?? 0,
  //         isFetching,
  //         error,
  //       };
  //     },
  //   }
  // );

  const handleVerifyToken = useCallback(async () => {
    try {
      if (!webStorageClient.get("_access_token")) {
        message.error("Bạn cần đăng nhập để truy cập trang này");
        throw new Error("Bạn cần đăng nhập để truy cập trang này");
      }
      setIsAuth(true);
      message.success("Kiểm tra truy cập thành công");
    } catch (error) {
      setIsAuth(false);
      router.push(`/${localActive}/sign-in`);
    }
  }, [localActive, router]);

  const getClubInfo = useCallback(async () => {
    try {
      const { club, membership } = await checkIsMember({
        name: slug?.toUpperCase() as string,
      }).unwrap();
      setRole(membership?.role?.name as "Admin" | "Manager" | "Member");
      dispatch(actionAccessClub(club));
      if (club?.name) {
        setIsAuth(true);
      }
    } catch (error) {
      message.error("Không thể truy cập trang này");
      router.push(`/${localActive}/`);
    }
  }, [checkIsMember, dispatch, localActive, router, slug]);

  useLayoutEffect(() => {
    getClubInfo();
  }, [getClubInfo]);

  const sideBarMenuFormat = clubSidebarMenu(slug)
    ?.filter((item: any) => (role !== "Manager" ? !item.isForManager : true))
    ?.map((item: any) => ({
      ...item,
      label: t(item.label),
      link: `/${item.key}`,
      children: item?.children?.map((subItem: any) => ({
        ...subItem,
        label: t(subItem.label),
      })),
    }));

  const NotificationCard: React.FC = () => {
    const userId = userInfo?._id;
    const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);
    const [markNotificationAsRead] = useMarkNotificationAsReadMutation();
    const [notificationItems, setNotificationItems] = useState<
      NotificationItem[]
    >([]);
    const { data } = useGetAllNotificationByUserIdQuery({
      id: userId,
      status: "",
    });
    useEffect(() => {
      if (data?.data?.notifications) {
        setNotificationItems(transformData(data?.data?.notifications));
      }
    }, [data]);

    console.log("hello", data?.data?.notifications);

    const transformData = useCallback(
      (notifications: any[]): NotificationItem[] => {
        return notifications.map((notification) => ({
          id: notification?._id,
          title: notification?.title,
          description: notification?.message.replace(/<[^>]*>?/gm, ""),
          time: new Date(notification.createdAt).toLocaleTimeString(),
          icon: notification?.createdBy?.avatarUrl,
          type: "TODAY",
          isReadByUser: notification?.readBy.some(
            (readEntry: any) => readEntry?.user?._id === userId
          ),
        }));
      },
      [userId]
    );

    useEffect(() => {
      if (data?.data?.notifications) {
        setNotificationItems(transformData(data?.data?.notifications));
      }
    }, [data, transformData]);

    const handleNotificationClick = async (item: NotificationItem) => {
      if (!item.isReadByUser) {
        await markNotificationAsRead({ id: item.id, userId });
        setNotificationItems((prevItems) =>
          prevItems.map((notification) =>
            notification.id === item.id
              ? { ...notification, isReadByUser: true }
              : notification
          )
        );
      }
      router.push(
        `/${localActive}/club-management/FU-DEVER/notification-detail/${item.id}`
      );
    };

    const openNotification = () => {
      notification.open({
        message: t("notification"),
        description: (
          <div style={{ maxHeight: 300, overflowY: "auto" }}>
            <List
              itemLayout="horizontal"
              dataSource={notificationItems}
              renderItem={(item) => (
                <List.Item
                  onClick={() => handleNotificationClick(item)}
                  onMouseEnter={() => setHoveredItemId(item.id)}
                  onMouseLeave={() => setHoveredItemId(null)}
                  style={{
                    backgroundColor: item.isReadByUser ? "#e0e0e0" : "#fff",
                    cursor: "pointer",
                    borderRadius: 8, // Rounded corners
                    padding: "12px 16px", // Enhanced padding for spacing
                    marginBottom: 8, // Space between items
                    transition: "background-color 0.3s", // Smooth hover transition
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={item.icon}
                        size="50"
                        style={{
                          backgroundColor: "#87d068",
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        {item.icon ? null : item.title.charAt(0).toUpperCase()}
                      </Avatar>
                    }
                    title={
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span style={{ fontWeight: "bold" }}>{item.title}</span>
                        <span style={{ fontSize: 12, color: "#888" }}>
                          {/* {moment(item.time).fromNow()}{" "} */}
                          {moment(
                            `${new Date().toLocaleDateString()} ${item.time}`,
                            "DD/MM/YYYY HH:mm:ss"
                          ).fromNow()}{" "}
                          {/* Format for relative time */}
                        </span>
                      </div>
                    }
                    description={
                      <ReactQuill
                        value={
                          item.description.length > 100
                            ? `${item.description.slice(0, 100)}...`
                            : item.description
                        }
                        readOnly
                        theme="bubble"
                      />
                    }
                  />
                </List.Item>
              )}
            />
          </div>
        ),
        duration: 0,
        placement: "topRight",
        style: { width: 400, padding: "8px 16px", borderRadius: 12 },
        closeIcon: <CloseOutlined />,
        btn: (
          <Space>
            <Button type="link" icon={<ExportOutlined />} />
            <Button type="link" icon={<MoreOutlined />} />
          </Space>
        ),
      });
    };
    return (
      <Button
        onClick={openNotification}
        style={{ border: 0, borderRadius: "50%" }}
        icon={<BellOutlined />}
      />
    );
  };

  return (
    <>
      {!isAuth ? (
        <LoadingScreen />
      ) : (
        <Layout hasSider>
          <S.SiderCustom trigger={null} collapsible collapsed={collapsed}>
            <S.LogoWrapper onClick={() => router?.push(`/${localActive}/`)}>
              <div className="demo-logo-vertical">
                <Flex align="center" justify="space-between">
                  <Flex align="center" gap={12}>
                    <Image
                      alt=""
                      src={"/icons/layout/logo.svg"}
                      width={40}
                      height={40}
                    />
                    {!collapsed && (
                      <Typography.Title
                        level={4}
                        $color={themes?.default?.colors?.primary}
                      >
                        FU-DEVER
                      </Typography.Title>
                    )}
                  </Flex>
                </Flex>
              </div>
            </S.LogoWrapper>

            <Menu
              mode="inline"
              defaultSelectedKeys={[getRootPathname(pathname)]}
              items={sideBarMenuFormat}
              onClick={(e) => router?.push(`/${localActive}/${e?.key}`)}
            />
          </S.SiderCustom>
          <S.LayoutCustom $collapsed={collapsed}>
            <AppProgressBar
              height="4px"
              color={themeColors.primary}
              options={{ showSpinner: false }}
              shallowRouting
            />
            <S.HeaderCustom $collapsed={collapsed}>
              <S.ButtonWrap
                onClick={() => setCollapsed((prev) => !prev)}
                $collapsed={collapsed}
              >
                <MenuFoldOutlined />
              </S.ButtonWrap>
              <Flex align="center" gap={20}>
                <SelectLanguage />
                <NotificationCard />
                <Popover
                  content={<DropdownMenu />}
                  trigger="click"
                  open={isShowMenu}
                  onOpenChange={() => setIsShowMenu(!isShowMenu)}
                  placement="bottomRight"
                >
                  <Flex>
                    <S.AvatarCustom
                      size={40}
                      src={
                        <Image
                          src={userInfo?.avatarUrl}
                          alt="avatar"
                          width={100}
                          height={64}
                        />
                      }
                    />
                  </Flex>
                </Popover>
              </Flex>
            </S.HeaderCustom>
            <S.ContentCustom>{children}</S.ContentCustom>
            <S.FooterCustom>
              <p>COPYRIGHT © 2024 DashTail All rights Reserved</p>
            </S.FooterCustom>
          </S.LayoutCustom>
        </Layout>
      )}
    </>
  );
};

export default ClubLayout;
