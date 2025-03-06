"use client";

import { endpointAuth } from "@/helpers/enpoints";
import { baseApi } from "../base";

export const authAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    verifyToken: build.mutation({
      query: (token: string) => ({
        url: endpointAuth.VERIFY_TOKEN,
        method: "POST",
        body: { token },
        flashError: true,
      }),
    }),
    signIn: build.mutation({
      query: (data: { email: string; password: string; remember: string }) => ({
        url: endpointAuth.SIGN_IN,
        method: "POST",
        body: data,
        flashError: true,
      }),
    }),
    signInWithGoogle: build.mutation({
      query: (data) => ({
        url: endpointAuth.SIGN_IN_WITH_GOOGLE,
        method: "POST",
        body: data,
        flashError: true,
      }),
    }),
    signUp: build.mutation({
      query: (data: {
        firstname: string;
        lastname: string;
        email: string;
        gender: string;
        password: string;
        passwordConfirm: string;
        phoneNumber: string;
        username: string;
      }) => ({
        url: endpointAuth.SIGN_UP,
        method: "POST",
        body: data,
        flashError: true,
      }),
    }),
    forgetPassword: build.mutation({
      query: (data: { email: string }) => ({
        url: endpointAuth.FORGET_PASSWORD,
        method: "POST",
        body: { data },
        flashError: true,
      }),
    }),
    resetPassword: build.mutation({
      query: (data: {
        body: { password: string; passwordConfirm: string };
        params: { token?: any };
      }) => ({
        url: endpointAuth.RESET_PASSWORD.replace("{token}", data.params.token),
        method: "POST",
        body: data.body,
        flashError: true,
      }),
    }),
    checkIsMember: build.mutation({
      query: (data) => ({
        url: endpointAuth.CHECK_IS_MEMBER,
        body: data,
        method: "POST",
        flashError: true,
      }),
    }),
    resetPasswordNoToken: build.mutation({
      query: (data: {
        body: { password: string; passwordConfirm: string };
      }) => ({
        url: endpointAuth.RESET_PASSWORD_NO_TOKEN,
        method: "POST",
        body: data.body,
        flashError: true,
      }),
    }),
  }),
});

export const {
  useVerifyTokenMutation,
  useSignInMutation,
  useSignInWithGoogleMutation,
  useSignUpMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
  useResetPasswordNoTokenMutation,
  useCheckIsMemberMutation,
} = authAPI;
