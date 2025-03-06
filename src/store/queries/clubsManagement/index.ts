"use client";

import { endpointAuth, endpointClubCategoryManagement, endpointClubsManagement } from "@/helpers/enpoints";
import { baseApi } from "../base";

interface NewClub {
  name: string;
  subname: string;
  category: string;
  description: string;
  avatarUrl: string;
  bannerUrl: string;
  activityPoint: number;
  balance: number;
  isActive: boolean;
}


export const authAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    verifyToken: build.mutation<{ token: string }, string>({
      query: (token: string) => ({
        url: endpointAuth.VERIFY_TOKEN,
        method: "POST",
        body: { token },
        flashError: true,
      }),
    }),
    getAllClubs: build.query<any, { page: number }>({
      query: () => ({
        url: endpointClubsManagement.GET_ALL_CLUBS,
        method: "GET",
        flashError: true,
      }),
    }),
    getAllClubCategories: build.query<any, { page: number }>({
      query: () => ({
        url: endpointClubCategoryManagement.GET_ALL_CLUB_CATEGORY,
        method: "GET",
        flashError: true,
      }),
    }),
    addNewClub: build.mutation<any, NewClub>({
      query: (newClub) => ({
        url: endpointClubsManagement.ADD_NEW_CLUB,
        method: "POST",
        body: newClub,
        flashError: true,
      }),
    }),
    updateClub: build.mutation<{ id: string; data: NewClub }, any>({
      query: ({ id, data }) => ({
        url: `${endpointClubsManagement.UPDATE_CLUB}/${id}`, 
        method: "PATCH", 
        body: data,
        flashError: true,
      })
    }),
  }),
  overrideExisting: true,
});

export const { 
  useVerifyTokenMutation, 
  useGetAllClubsQuery, 
  useGetAllClubCategoriesQuery, 
  useAddNewClubMutation, 
  useUpdateClubMutation 
} = authAPI;
