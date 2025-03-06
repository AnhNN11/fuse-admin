import React from "react";
import { MenuProps } from "antd";
import {
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";

export const userDropdownMenu: MenuProps["items"] = [
  {
    key: "profile",
    icon: React.createElement(UserOutlined),
    label: "Profile",
  },
  {
    key: "my-applications",
    icon: React.createElement(AppstoreOutlined),
    label: "My Application",
  },
  {
    type: "divider",
  },
  {
    key: "logout",
    icon: React.createElement(LogoutOutlined),
    label: "Logout",
  },
];
