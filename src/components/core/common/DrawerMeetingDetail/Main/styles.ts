import styled from "styled-components";
import { Drawer, Select as SelectFromAntd } from "antd";

export const DrawerCustom = styled(Drawer)`
  .ant-drawer-header {
    background-color: ${({ theme }) => theme.colors.primary};
  }
  .ant-drawer-title {
    color: ${({ theme }) => theme.colors.textWhite} !important;
  }
`;
