import styled from "styled-components";
import { Select as SelectFromAntd } from "antd";

export const PageWrapper = styled.section`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100%;

  padding-bottom: 16px;

  .ant-select {
    width: 100%;
  }
`;

export const Head = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;

  margin-bottom: 24px;
`;

export const TableWrapper = styled.div`
  width: 100%;

  margin-bottom: 24px;

  margin-top: 24px;
`;

export const FilterWrapper = styled.div`
  margin-bottom: 24px;
`;
export const Select = styled(SelectFromAntd)`
  width: 100%;
`;

export const SelectStatus = styled(Select)<{ $status: string }>`
  .ant-select-selector {
    ${(props) => {
      switch (props.$status) {
        case "APPROVED":
          return "background-color: #52c41a !important;";
        case "REJECTED":
          return "background-color: #ff4d4e !important;";
        default:
          return "background-color: #faac14 !important;";
      }
    }}
    color: white !important;
  }

  .ant-select-suffix {
    color: white !important;
  }
`;
