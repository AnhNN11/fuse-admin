import { constants } from "@/settings";
import webStorageClient from "@/utils/webStorageClient";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: constants.API_SERVER,
  prepareHeaders: (headers) => {
    const accessToken = webStorageClient.getToken();
    const currentClubFromStorage = webStorageClient.get(constants.CURRENT_CLUB);
    console.log("🚀 ~ currentClubFromStorage:", currentClubFromStorage);

    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }

    if (currentClubFromStorage) {
      headers.set("ClubId", `${currentClubFromStorage}`);
    }

    return headers;
  },
});

export const baseApi = createApi({
  baseQuery: baseQuery,
  endpoints: () => ({}),
});
