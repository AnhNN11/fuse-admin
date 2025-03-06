"use client";

import { endpointPost } from "@/helpers/enpoints";
import { baseApi } from "../base";

export const postAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createPost: build.query({
      query: (data) => ({
        url: endpointPost.CREATE_POST,
        method: "POST",
        body: data,
        flashError: true,
      }),
    }),
  }),
});

export const { useCreatePostQuery } = postAPI;
