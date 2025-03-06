"use client";

import { endpointEventsManagement } from "@/helpers/enpoints";

import { baseApi } from "../base";

export const authAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createEvent: build.mutation({
      query: (data) => ({
        url: endpointEventsManagement.CREATE_EVENT,
        method: "POST",
        body: data,
        flashError: true,
      }),
    }),
  }),
});

export const { useCreateEventMutation } = authAPI;
