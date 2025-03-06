"use client";

import { endpointFinancessManagement } from "@/helpers/enpoints";
import { baseApi } from "../base";

export const financesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllFinances: build.mutation<
      any,
      {
        clubId: string;
        page: number;
        page_size: number;
        search: string;
        type?: string;
      }
    >({
      query: (params) => ({
        url: endpointFinancessManagement.GET_ALL,
        params: params,
        method: "GET",
        flashError: true,
      }),
    }),
    addFinance: build.mutation<
      any,
      {
        clubId: string;
        title: string;
        content: string;
        type: string;
        amount: number;
      }
    >({
      query: (params) => ({
        url: endpointFinancessManagement.ADD,
        body: params,
        method: "POST",
        flashError: true,
      }),
    }),
    getFund: build.mutation<any, { clubId: string }>({
      query: (params) => ({
        url: endpointFinancessManagement.ADD_FUND + `?clubId=${params.clubId}`,
        method: "GET",
        flashError: true,
      }),
    }),
    getFundToken: build.mutation<any, { token: string }>({
      query: (params) => ({
        url: endpointFinancessManagement.ADD_FUND + `/${params.token}/token`,
        method: "GET",
        flashError: true,
      }),
    }),
    addFunds: build.mutation<
      any,
      {
        clubId: string;
        title: string;
        content: string;
        creator: string;
        amount: number;
      }
    >({
      query: (params) => ({
        url: endpointFinancessManagement.ADD_FUND,
        body: params,
        method: "POST",
        flashError: true,
      }),
    }),
    payFund: build.mutation<any, { id: string; status: string }>({
      query: (params) => ({
        url: endpointFinancessManagement.ADD_FUND + "/" + params.id,
        body: params,
        method: "PUT",
        flashError: true,
      }),
    }),
    getUserFund: build.mutation<any, { id: string }>({
      query: (params) => ({
        url: endpointFinancessManagement.ADD_FUND + "/" + params.id,
        params: params,
        method: "GET",
        flashError: true,
      }),
    }),
    pay: build.mutation<
      any,
      { amount: number; lang: string; clb: string; eng: string; msg: string }
    >({
      query: (params) => ({
        url: endpointFinancessManagement.PAY,
        body: params,
        method: "POST",
        flashError: true,
      }),
    }),
  }),
});

export const {
  useGetAllFinancesMutation,
  useAddFinanceMutation,
  useGetFundMutation,
  useGetFundTokenMutation,
  useAddFundsMutation,
  usePayFundMutation,
  useGetUserFundMutation,
  usePayMutation,
} = financesApi;
