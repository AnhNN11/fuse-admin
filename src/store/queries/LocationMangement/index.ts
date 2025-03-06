"use client";

import { endpointLoaction } from "@/helpers/enpoints";
import { baseApi } from "../base";

export const authAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllLoactions: build.query({
      query: () => ({
        url: endpointLoaction.GET_ALL_LOCATIONS,
        method: "GET",
        flashError: true,
      }),
    }),
  }),
});

export const { useGetAllLoactionsQuery } = authAPI;
