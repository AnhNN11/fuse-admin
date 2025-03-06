"use client";

import { endpointSemestersManagement } from "@/helpers/enpoints";

import { baseApi } from "../base";

export const authAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createSemester: build.mutation({
      query: (data) => ({
        url: endpointSemestersManagement.CREATE_SEMESTER,
        method: "POST",
        body: data,
        flashError: true,
      }),
    }),
    getAllSemester: build.query({
      query: () => ({
        url: endpointSemestersManagement.GET_ALL_SEMESTERS,
        method: "GET",
        flashError: true,
      }),
    }),
    deleteSemester: build.mutation({
      query: (id) => ({
        url: endpointSemestersManagement.DELETE_SEMESTER.replace("{id}", id),
        method: "DELETE",
        flashError: true,
      }),
    }),
    updateSemester: build.mutation({
      query: (data) => ({
        url: endpointSemestersManagement.UPDATE_SEMESTER.replace(
          "{id}",
          data?.id
        ),
        method: "PATCH",
        body: data,
        flashError: true,
      }),
    }),
  }),
});

export const {
  useCreateSemesterMutation,
  useGetAllSemesterQuery,
  useDeleteSemesterMutation,
  useUpdateSemesterMutation,
} = authAPI;
