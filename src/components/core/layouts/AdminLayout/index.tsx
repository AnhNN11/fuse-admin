"use client";

import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import Image from "next/image";
import { MenuFoldOutlined } from "@ant-design/icons";
import { Flex, Layout, Menu, Popover, message } from "antd";
import { useParams, usePathname } from "next/navigation";
import { AppProgressBar, useRouter } from "next-nprogress-bar";
import { useLocale } from "next-intl";

import DropdownMenu from "./DropdownMenu";
import SelectLanguage from "./SelectLanguage";
import Typography from "../../common/Typography";
import LoadingScreen from "../../common/LoadingScreen";

import { adminSidebarMenu } from "@/helpers/data/sidebarMenu";
import { useTranslation } from "@/app/i18n/client";
import { themes } from "@/style/themes";
import { useVerifyTokenMutation } from "@/store/queries/auth";
import webStorageClient from "@/utils/webStorageClient";
import { getRootPathname } from "@/utils/getPathname";
import themeColors from "@/style/themes/default/colors";

import * as S from "./styles";
import { useAppSelector } from "@/hooks/redux-toolkit";

const AdminLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const params = useParams();
  const router = useRouter();
  const localActive = useLocale();
  const pathname = usePathname();

  const { userInfo } = useAppSelector((state) => state.auth);

  const { t } = useTranslation(params?.locale as string, "layout");

  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [isShowMenu, setIsShowMenu] = useState<boolean>(false);
  const [isAuth, setIsAuth] = useState<boolean>(true); //

  const [verifyToken] = useVerifyTokenMutation();
  const [userAvt, setUserAvt] = useState<any>();
  useEffect(() => {
    setUserAvt(userInfo?.avatarUrl);
  }, [userInfo?.avatarUrl]);

  const handleVerifyToken = useCallback(async () => {
    try {
      if (!webStorageClient.get("_access_token")) {
        message.error("Bạn cần đăng nhập để truy cập trang này");
        throw new Error("Bạn cần đăng nhập để truy cập trang này");
      }
      //   await verifyToken(webStorageClient.get("_access_token") || "??").unwrap();
      setIsAuth(true);
      message.success("Kiểm tra truy cập thành công");
    } catch (error) {
      setIsAuth(false);
      router.push(`/${localActive}/`);
    }
  }, [localActive, router]);

  useLayoutEffect(() => {
    handleVerifyToken();
  }, [handleVerifyToken]);

  const sideBarMenuFormat = adminSidebarMenu?.map((item: any) => ({
    ...item,
    label: t(item.label),
    link: `/${item.key}`,
  }));

  return (
    <>
      {!isAuth ? (
        <LoadingScreen />
      ) : (
        <Layout hasSider>
          <S.SiderCustom trigger={null} collapsible collapsed={collapsed}>
            <S.LogoWrapper
              onClick={() => router?.push(`/${localActive}/dashboard`)}
            >
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
                        Admin
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
                          src={userAvt}
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

export default AdminLayout;
