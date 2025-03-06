"use client";

import { endpointRolesManagement } from "@/helpers/enpoints";
import { baseApi } from "../base";

export const roleAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllRoles: build.query({
      query: () => ({
        url: endpointRolesManagement.GET_ALL_ROLES,
        method: "GET",
        flashError: true,
      }),
    }),
  }),
});

export const { useGetAllRolesQuery } = roleAPI;
