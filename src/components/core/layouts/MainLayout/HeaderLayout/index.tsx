"use client";

import Typography from "@/components/core/common/Typography";
import { useAppSelector } from "@/hooks/redux-toolkit";
import { themes } from "@/style/themes";
import { Avatar, Button, Flex, Popover } from "antd";
import { useRouter } from "next-nprogress-bar";
import Image from "next/image";
import Link from "next/link";
import SelectLanguage from "./SelectLanguage";
import DropdownMenu from "./DropdownMenu";
import { useEffect, useState } from "react";

function HeaderLayoutComponent() {
  const { userInfo } = useAppSelector((state) => state.auth);
  console.log("🚀 ~ HeaderLayoutComponent ~ userInfo:", userInfo);

  const [isShowMenu, setIsShowMenu] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
  }, []);

  const router = useRouter();
  const items = [
    {
      title: "Trang chủ",
      href: "/",
    },
    {
      title: "Sự kiện",
      href: "/events",
    },
    {
      title: "Câu lạc bộ",
      href: "/clubs",
    },
  ];
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "white",
        boxShadow: "0 8px 12px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "0 80px",
          height: "80px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            cursor: "pointer",
          }}
          onClick={() => router.push("/")}
        >
          <Image alt="" src={"/icons/layout/logo.svg"} width={40} height={40} />

          <Typography.Title level={4} $color={themes?.default?.colors?.primary}>
            NEXTTEAM
          </Typography.Title>
        </div>
        <Flex align="center" gap={20}>
          {items?.map((item) => (
            <Button
              key={item.title}
              type="link"
              style={{
                color: themes?.default?.colors?.primary,
              }}
              onClick={() => router.push(item.href)}
            >
              {item.title}
            </Button>
          ))}
        </Flex>
        {loading && userInfo ? (
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
                <Avatar
                  style={{
                    border: `1px solid ${themes?.default?.colors?.primary}`,
                  }}
                  size={40}
                  src={
                    <Image
                      src={userInfo?.avatarUrl}
                      alt="avatar"
                      width={64}
                      height={64}
                    />
                  }
                />
              </Flex>
            </Popover>
          </Flex>
        ) : (
          <Flex align="center" gap={20}>
            <Link href="/sign-in">
              <Button type="link">
                <Typography.Text>Đăng nhập</Typography.Text>
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button type="primary" size="large">
                <Typography.Text $color="white">Đăng ký</Typography.Text>
              </Button>
            </Link>
          </Flex>
        )}
      </div>
    </div>
  );
}
export default HeaderLayoutComponent;
