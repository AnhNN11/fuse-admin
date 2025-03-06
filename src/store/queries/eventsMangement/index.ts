"use client";

import { endpointEventsManagement } from "@/helpers/enpoints";

import { baseApi } from "../base";

export const authAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllEvents: build.query<
      any,
      { page: number; limit: number; search: string; filters: string }
    >({
      query: (params) => ({
        url: endpointEventsManagement.GET_ALL_EVENTS,
        params: params,
        method: "GET",
        flashError: true,
      }),
    }),
    getAllEventsForAdmin: build.query<
      any,
      { page: number; limit: number; search: string; filters: string }
    >({
      query: (params) => ({
        url: endpointEventsManagement.ADMIN_GET_ALL_EVENTS,
        params: params,
        method: "GET",
        flashError: true,
      }),
    }),
    getAllEventsForManager: build.query<
      any,
      { page: number; limit: number; search: string; filters: string }
    >({
      query: (params) => ({
        url: endpointEventsManagement.MANAGER_GET_ALL_EVENTS,
        params: params,
        method: "GET",
        flashError: true,
      }),
    }),
    getEventById: build.query({
      query: (id) => ({
        url: endpointEventsManagement.GET_EVENT_DETAIL.replace("{id}", id),
        method: "GET",
        flashError: true,
      }),
    }),
    createEvent: build.mutation({
      query: (data) => ({
        url: endpointEventsManagement.CREATE_EVENT,
        method: "POST",
        body: data,
        flashError: true,
      }),
    }),
    deleteEvent: build.mutation({
      query: (id) => ({
        url: endpointEventsManagement.DELETE_EVENT.replace("{id}", id),
        method: "DELETE",
        flashError: true,
      }),
    }),
    updateEvent: build.mutation({
      query: (data) => ({
        url: endpointEventsManagement.UPDATE_EVENT.replace("{id}", data?.id),
        method: "PATCH",
        body: data?.body,
        flashError: true,
      }),
    }),
    registerEvent: build.mutation({
      query: (id) => ({
        url: endpointEventsManagement.REGISTER_EVENT.replace("{id}", id),
        method: "POST",
        flashError: true,
      }),
    }),
    getAllRegistrations: build.query({
      query: (id) => ({
        url: endpointEventsManagement.EVENT_REGISTRATIONS.replace("{id}", id),
        method: "GET",
        flashError: true,
      }),
    }),
    takeAttendance: build.mutation({
      query: (data) => ({
        url: endpointEventsManagement.TAKE_ATTENDANCE,
        method: "POST",
        body: data,
        flashError: true,
      }),
    }),
  }),
});

export const {
  useGetAllEventsQuery,
  useGetEventByIdQuery,
  useCreateEventMutation,
  useDeleteEventMutation,
  useUpdateEventMutation,
  useGetAllEventsForAdminQuery,
  useGetAllEventsForManagerQuery,
  useRegisterEventMutation,
  useGetAllRegistrationsQuery,
  useTakeAttendanceMutation,
} = authAPI;
