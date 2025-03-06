import { Image, Modal } from "antd";
import styled from "styled-components";
import { UserModalProps } from ".";

const unselectable = `
-webkit-user-select: none;
-moz-user-select: none;
-ms-user-select: none;
user-select: none;
`;

export const UnTD = styled("td")`
  ${unselectable}
`;

export const UserModal = styled(Modal)<UserModalProps>`
  width: 50% !important;
  max-height: 80vh;
  .ant-modal-content {
    margin-bottom: 50px;
    overflow: hidden;
    max-height: 100%;
    padding: 0 0 20px 0 !important;
    .ant-modal-header {
      display: none;
    }
    .ant-modal-close {
      background-color: #8884;
      &:hover {
        background-color: #8888;
      }
    }
    .ant-modal-footer {
      padding: 0 5%;
    }
  }
`;

export const Scrollable = styled("div")({
  overflow: "auto",
});

export const UserImage = styled(Image)`
  ${unselectable}
  object-fit: cover;
  cursor: pointer;
  @at-root p#{&} {
    width: 100% !important;
  }
`;

export const BannerWrapper = styled("div")`
  &::after {
    background: gray;
    width: 100px;
    height: 100px;
  }
`;

export const AvatarWrapper = styled("div")`
  ${unselectable}
  width: fit-content;
  border-radius: 50%;
  overflow: hidden;
  padding: 3px;
  background-color: ${(props) => props?.theme?.colors?.primary};
  transform: translateZ(10px);
`;

export const BaseInfoWrapper = styled("div")`
  margin-left: 50px;
  width: fit-content;
  display: flex;
  margin-top: -75px;
  align-items: center;
`;

export const NameWrapper = styled("div")`
  margin-left: 20px;
  transform: translateZ(10px);
`;

export const SectionTitle = styled("h3")`
  color: ${(props) => props?.theme?.colors?.primary};
  border-bottom: 2px solid ${(props) => props?.theme?.colors?.primary};
  margin-bottom: 10px;
  ${unselectable}
  margin-top: 30px;
`;

export const ProfileBody = styled("div")({
  width: "90%",
  margin: "20px auto",
});

export const DataTable = styled("table")`
  width: 100%;
  tr {
    td:first-child {
      width: 15%;
      margin-right: 20px;
    }
    td {
    }
  }
`;
