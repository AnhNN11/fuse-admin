"use client";

import { endpointUsersManagement } from "@/helpers/enpoints";
import { baseApi } from "../base";

export const authAPI = baseApi.injectEndpoints({
	endpoints: (build) => ({
		getAllUsers: build.query<any, { page: number; page_size: number; search: string }>({
			query: (params) => ({
				url: endpointUsersManagement.GET_ALL_USERS,
				params: params,
				method: "GET",
				flashError: true,
			}),
		}),
		getUser: build.query<any, { id: string }>({
			query: (params) => ({
				url: endpointUsersManagement.GET_USER + params.id,
				params: params,
				method: "GET",
				flashError: true,
			}),
		}),
		getUser_: build.mutation<any, { id: string }>({
			query: (params) => ({
				url: endpointUsersManagement.GET_USER + params.id,
				method: "GET",
				flashError: true,
			}),
		}),
		updateUser: build.mutation({
			query: (params) => ({
				url: endpointUsersManagement.GET_USER,
				method: "PUT",
				body: params,
				flashError: true,
			}),
		}),
		updateAvatar: build.mutation({
			query: (formData) => ({
				url: endpointUsersManagement.UPDATE_AVT,
				method: "POST",
				body: formData,
				flashError: true,
			}),
		}),
	}),
});

export const { useGetAllUsersQuery, useGetUserQuery, useUpdateUserMutation, useUpdateAvatarMutation, useGetUser_Mutation } =
	authAPI;
