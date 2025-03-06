"use client";

import { endpointEnagagementManagement } from "@/helpers/enpoints";
import { baseApi } from "../base";

interface EngagementUpdateDataType {
  _id: string;
  department: string;
  role: string;
  status: "NEW" | "REJECTED" | "MEMBER" | "DROP_OUT";
  step: number;
}

export const engagementAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllEngagementWithPagination: build.query<
      any,
      {
        id: string;
        page: number;
        limit: number;
        search: string;
        filters: any;
      }
    >({
      query: (params) => ({
        url: endpointEnagagementManagement.GET_ALL_ENGAGEMENT_WITH_PAGINATION,
        params: params,
        method: "GET",
        flashError: true,
      }),
    }),
    getEngagementById: build.query({
      query: (id) => ({
        url: endpointEnagagementManagement.GET_ENGAGEMENT_DETAIL.replace(
          "{id}",
          id
        ),
        method: "GET",
        flashError: true,
      }),
    }),
    updateEngagement: build.mutation({
      query: (data) => ({
        url: endpointEnagagementManagement.UPDATE_ENGAGEMENT.replace(
          "{id}",
          data?.id
        ),
        method: "PATCH",
        body: data?.body,
        flashError: true,
      }),
    }),
    createEngagement: build.mutation({
      query: (data) => ({
        url: endpointEnagagementManagement.CREATE_ENGAGEMENT,
        method: "POST",
        body: data?.body,
        flashError: true,
      }),
    }),
    getMyApplication: build.query<
      any,
      {
        id: string;
        page: number;
        limit: number;
        search: string;
        filters: any;
      }
    >({
      query: (params) => ({
        url: endpointEnagagementManagement.GET_MY_APPLICATION,
        params: params,
        method: "GET",
        flashError: true,
      }),
    }),
    getCurrentEngagement: build.mutation<
      any,
      { userId: string; clubId: string }
    >({
      query: (params) => ({
        url:
          endpointEnagagementManagement.CREATE_ENGAGEMENT +
          params.userId +
          "/" +
          params.clubId,
        params: params,
        method: "GET",
        flashError: true,
      }),
    }),
    getMyClubs: build.query({
      query: (id) => ({
        url: endpointEnagagementManagement.GET_MY_CLUB.replace("{id}", id),
        method: "GET",
        flashError: true,
      }),
    }),
  }),
});

export const {
  useGetAllEngagementWithPaginationQuery,
  useGetEngagementByIdQuery,
  useUpdateEngagementMutation,
  useGetMyApplicationQuery,
  useCreateEngagementMutation,
  useGetCurrentEngagementMutation,
  useGetMyClubsQuery,
} = engagementAPI;
