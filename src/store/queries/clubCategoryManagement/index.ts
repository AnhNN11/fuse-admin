"use client";

import { endpointClubCategoryManagement } from "@/helpers/enpoints";
import { baseApi } from "../base";

export const clubCategoryAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllClubCategory: build.query({
      query: () => ({
        url: endpointClubCategoryManagement.GET_ALL_CLUB_CATEGORY,
        method: "GET",
        flashError: true,
      }),
    }),
  }),
});

export const { useGetAllClubCategoryQuery } = clubCategoryAPI;
