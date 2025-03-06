"use client";

import { baseApi } from "../base";
import { endpointDepartmentManagement } from "@/helpers/enpoints";

export const departmentAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllDepartmentByClub: build.query<
      any,
      {
        id: string;
      }
    >({
      query: (params) => ({
        url: endpointDepartmentManagement.GET_ALL_DEPARTMENT_BY_CLUB,
        params: params,
        method: "GET",
        flashError: true,
      }),
    }),
  }),
});

export const { useGetAllDepartmentByClubQuery } = departmentAPI;
