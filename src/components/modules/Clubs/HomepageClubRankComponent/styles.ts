import styled from "styled-components";
export const ImageSquare = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
`;

export const PageWrapper = styled.section`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100%;
  max-width: 1440px;

  margin-left: auto;
  margin-right: auto;
  padding-left: 80px;
  padding-right: 80px;
  padding-bottom: 80px;
  padding-top: 40px;

  .ant-select {
    width: 100%;
  }
`;
