import styled from "styled-components";

export const BodyList = styled.div`
  display: flex;
  flex-direction: column;

  padding: 0 40px;
`;

export const CardWrapper = styled.div`
  width: 100%;

  display: flex;

  box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 24px 0px;

  border-radius: 20px;

  h4 {
    display: -webkit-box;
    -webkit-line-clamp: 2; /* Number of lines */
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const ModalContent = styled.div`
  padding: 20px 60px;
`;
