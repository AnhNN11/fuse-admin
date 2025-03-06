"use client";

import {
  endpointEventsManagement,
  endpointMeetingsManagement,
} from "@/helpers/enpoints";

import { baseApi } from "../base";

export const authAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllMeeting: build.query<
      any,
      { page: number; limit: number; search: string; filters: string }
    >({
      query: (params) => ({
        url: endpointMeetingsManagement.GET_ALL_EVENTS,
        params: params,
        method: "GET",
        flashError: true,
      }),
    }),
    getMeetingById: build.query({
      query: (id) => ({
        url: endpointMeetingsManagement.GET_EVENT_DETAIL.replace("{id}", id),
        method: "GET",
        flashError: true,
      }),
    }),
    createMeeting: build.mutation({
      query: (data) => ({
        url: endpointMeetingsManagement.CREATE_MEETING,
        method: "POST",
        body: data,
        flashError: true,
      }),
    }),
    deleteMeeting: build.mutation({
      query: (id) => ({
        url: endpointMeetingsManagement.DELETE_EVENT.replace("{id}", id),
        method: "DELETE",
        flashError: true,
      }),
    }),
    updateMeeting: build.mutation({
      query: (data) => {
        console.log(data);

        return {
          url: endpointMeetingsManagement.UPDATE_EVENT.replace(
            "{id}",
            data?.id
          ),
          method: "PUT",
          body: data,
          flashError: true,
        };
      },
    }),
  }),
});

export const {
  useGetAllMeetingQuery,
  useGetMeetingByIdQuery,
  useCreateMeetingMutation,
  useDeleteMeetingMutation,
  useUpdateMeetingMutation,
} = authAPI;
