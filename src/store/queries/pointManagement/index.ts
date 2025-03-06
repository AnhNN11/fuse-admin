"use client";

import { endpointPointsManagement } from "@/helpers/enpoints";

import { baseApi } from "../base";

export const authAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllPoints: build.query<any, { page: number; limit: number }>({
      query: (params) => ({
        url: endpointPointsManagement.GET_ALL_POINT_USERS,
        params: params,
        method: "GET",
        flashError: true,
      }),
    }),
  }),
});

export const { useGetAllPointsQuery } = authAPI;
