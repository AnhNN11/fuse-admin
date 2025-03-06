import React from "react";
import { MenuProps } from "antd";

import {
  PieChartOutlined,
  UserOutlined,
  DollarOutlined,
  CalendarOutlined,
  AuditOutlined,
  InsertRowAboveOutlined,
  TeamOutlined,
  BellOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";

export const adminSidebarMenu: MenuProps["items"] = [
  {
    key: "admin/dashboard",
    icon: React.createElement(PieChartOutlined),
    label: "dashboard",
  },
  {
    key: "admin/user-management",
    icon: React.createElement(UserOutlined),
    label: "usersManagement",
  },
  {
    key: "admin/event-management",
    icon: React.createElement(PieChartOutlined),

    label: "eventManagement",
  },
  {
    key: "admin/human-resources",
    icon: React.createElement(UserOutlined),

    label: "humanResource",
  },
  {
    key: "admin/club-management",
    icon: React.createElement(TeamOutlined),
    label: "clubManagement",
  },
  {
    key: "admin/notification-management",
    icon: React.createElement(BellOutlined),
    label: "notifications",
  },
];

export const clubSidebarMenu = (slug: string): any => [
  {
    key: `club-management/${slug}/dashboard`,
    icon: React.createElement(PieChartOutlined),
    label: "dashboard",
  },
  {
    key: `club-management/${slug}/event`,
    icon: React.createElement(CalendarOutlined),
    label: "event",
  },
  {
    key: `club-management/${slug}/member-list`,
    icon: React.createElement(UserOutlined),
    label: "memberList",
  },
  {
    key: `club-management/${slug}/meeting`,
    icon: React.createElement(WhatsAppOutlined),
    label: "Meeting",
  },
  {
    key: `club-management/${slug}/finances/fundscon`,
    icon: React.createElement(DollarOutlined),
    label: "fin.confund",
  },
  {
    key: `club-management/${slug}/finances`,
    icon: React.createElement(DollarOutlined),
    label: "finances",
    children: [
      {
        key: `club-management/${slug}/finances/revenue-expenses`,
        label: "fin.re",
      },
      { key: `club-management/${slug}/finances/funds`, label: "fin.fund" }
    ],
    isForManager: true,
  },
  {
    key: "#",
    icon: React.createElement(AuditOutlined),
    label: "humanResource",
    isForManager: true,
    children: [
      {
        key: `club-management/${slug}/member-management`,
        label: "memberManagement",
      },
      {
        key: `club-management/${slug}/human-resources`,
        label: "humanResource",
      },
    ],
  },
  {
    key: `club-management/${slug}/event-management`,
    icon: React.createElement(InsertRowAboveOutlined),
    label: "eventManagement",
    isForManager: true,
  },
  {
    key: `club-management/${slug}/notification-management`,
    icon: React.createElement(BellOutlined),
    label: "notifications",
    isForManager: true,
  },
];
