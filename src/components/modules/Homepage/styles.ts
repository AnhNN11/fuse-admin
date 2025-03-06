import styled from "styled-components";
import { Select as SelectFromAntd } from "antd";

export const PageWrapper = styled.section`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100%;
  max-width: 1440px;

  margin-left: auto;
  margin-right: auto;
  margin-top: 40px;
  padding-left: 80px;
  padding-right: 80px;
  padding-bottom: 80px;
  padding-top: 40px;

  .ant-select {
    width: 100%;
  }
`;

export const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
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

export const BodyList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;

  padding: 0 80px;
  margin-top: 40px;
`;

export const CardWrapper = styled.div`
  width: 100%;

  display: flex;

  box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 24px 0px;

  border-radius: 4px;

  h4 {
    display: -webkit-box;
    -webkit-line-clamp: 2; /* Number of lines */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const Image = styled.img`
  border-radius: 10px;
`;
