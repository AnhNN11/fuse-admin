"use client";

import styled from "styled-components";

export const Wrapper = styled.section`
  width: 100%;

  display: flex;
  flex-direction: column;

  h4 {
    margin-top: 32px;
    margin-bottom: 16px;

    font-size: 24px;
  }
  > p {
    margin-bottom: 32px;
  }
`;

export const SocialWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 16px;

  border: 1px solid ${(props) => props.theme.colors.primaryDark};

  cursor: pointer;

  transition: all 0.3s;

  margin-bottom: 16px;

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryLight};

    border: 1px solid ${(props) => props.theme.colors.primary};
  }
`;
