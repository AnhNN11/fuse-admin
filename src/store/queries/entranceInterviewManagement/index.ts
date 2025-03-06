"use client";

import { endpointEntracneInterviewManagement } from "@/helpers/enpoints";
import { baseApi } from "../base";

export const entranceInterviewAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createInterview: build.mutation({
      query: (data) => ({
        url: endpointEntracneInterviewManagement.CREATE_INTERVIEW.replace(
          "{id}",
          data?.id
        ),
        method: "PATCH",
        body: data?.body,
        flashError: true,
      }),
    }),
    interview: build.mutation({
      query: (data) => ({
        url: endpointEntracneInterviewManagement.INTERVIEW.replace(
          "{id}",
          data?.id
        ),
        method: "PATCH",
        body: data?.body,
        flashError: true,
      }),
    }),
  }),
});

export const { useCreateInterviewMutation,  useInterviewMutation} = entranceInterviewAPI;
