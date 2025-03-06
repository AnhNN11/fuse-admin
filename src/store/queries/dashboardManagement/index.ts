"use client";

import {
  endpointAuth,
  endpointClubCategoryManagement,
  endpointClubsManagement,
  endpointDashboard,
} from "@/helpers/enpoints";
import { baseApi } from "../base";

export const authAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getNumberMember: build.query<any, { page: number }>({
      query: () => ({
        url: endpointDashboard.GET_NUMBER_MEMBER,
        method: "GET",
        flashError: true,
      }),
    }),
  }),
  overrideExisting: true,
});

export const { useGetNumberMemberQuery } = authAPI;
