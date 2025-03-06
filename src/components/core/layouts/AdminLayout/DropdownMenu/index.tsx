import { Avatar, Flex } from "antd";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useLocale } from "next-intl";
import { useRouter } from "next-nprogress-bar";

import Divider from "@/components/core/common/Divider";

import { useTranslation } from "@/app/i18n/client";
import { userDropdownMenu } from "@/helpers/data/userDropdownMenu";
import webStorageClient from "@/utils/webStorageClient";

import * as S from "./styles";
import { useAppSelector } from "@/hooks/redux-toolkit";
import { useDispatch } from "react-redux";
import { actionLogout } from "@/store/slices/auth";

function DropdownMenu() {
  const params = useParams();
  const router = useRouter();
  const locale = useLocale();

  const { userInfo } = useAppSelector((state) => state.auth);
  const dispatch = useDispatch();

  const { t } = useTranslation(params?.locale as string, "layout");

  const sideBarMenuFormat = userDropdownMenu?.map((item: any) => ({
    ...item,
    label: t(item.label),
    link: `/${item.key}`,
  }));

  const handleClickItem = (key: string) => {
    switch (key) {
      case "profile":
        console.log("profile");
				router.push(`/${locale}/profile`);
        break;
      case "setting":
        console.log("setting");
        break;
      case "logout":
        dispatch(actionLogout());
        router.push(`/${locale}/sign-in`);
        break;
      default:
        break;
    }
  };

  return (
    <Flex vertical>
      <Flex gap={8} align="center">
        <Avatar
          size={28}
          src={
            <Image
              src={userInfo?.avatarUrl}
              alt="avatar"
              width={28}
              height={28}
            />
          }
        />
        <Flex vertical>
          <p>{userInfo?.firstname + " " + userInfo?.lastname}</p>
          <a>{userInfo?.username}</a>
        </Flex>
      </Flex>
      <Divider $margin={8} />
      <S.MenuCustom
        items={sideBarMenuFormat}
        onClick={(e) => handleClickItem(e?.key)}
      />
    </Flex>
  );
}

export default DropdownMenu;
