"use client";

import { endpointClubsManagement } from "@/helpers/enpoints";
import { baseApi } from "../base";

export const clubAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllClubWithPagination: build.query<
      any,
      { page: number; page_size: number; search: string; filters: any }
    >({
      query: (params) => ({
        url: endpointClubsManagement.GET_ALL_CLUBS_WITH_PAGINATION,
        params: params,
        method: "GET",
        flashError: true,
      }),
    }),
    getClubBySubname: build.query<any, { subname: string; userId: string }>({
      query: (params) => ({
        url: endpointClubsManagement.GET_BY_SUBNAME,
        params: params,
        method: "GET",
        flashError: true,
      }),
    }),
    getAllClubWithoutPagination: build.query({
      query: () => ({
        url: endpointClubsManagement.GET_ALL_CLUBS_WITHOUT_PAGINATION,
        method: "GET",
        flashError: true,
      }),
    }),
    getClubBySubnamev2: build.query<
      any,
      { subname: string; userId: string; page: number; limit: number }
    >({
      query: (params) => ({
        url: endpointClubsManagement.GET_ALL_CLUBS,
        params: params,
        method: "GET",
        flashError: true,
      }),
    }),
    getTop5Clubs: build.query({
      query: () => ({
        url: endpointClubsManagement.GET_TOP_5_CLUBS,
        method: "GET",
        flashError: true,
      }),
    }),
  }),
});

export const {
  useGetAllClubWithPaginationQuery,
  useGetClubBySubnameQuery,
  useGetAllClubWithoutPaginationQuery,
  useGetClubBySubnamev2Query,
  useGetTop5ClubsQuery,
} = clubAPI;
