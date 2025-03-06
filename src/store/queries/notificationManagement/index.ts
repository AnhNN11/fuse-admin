import { endpointNotificationsManagement } from "@/helpers/enpoints";
import { baseApi } from "../base";

export const notificationAPI = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAllNotificationsWithPagination: build.query<any, { page: number; page_size: number; search : string, clubId: string, createdAt: string, isOfAdmin: any }>({
      query: (params) => ({
        url: endpointNotificationsManagement.GET_ALL_NOTIFICATIONS_WITH_PAGINATION,
        params: params,
        method: "GET",
        flashError: true,
      }),
    }),
    getNotificationById: build.query<any, { id: string }>({
      query: (params) => ({
        url: endpointNotificationsManagement.GET_NOTIFICATION_BY_ID.replace(":id", params.id),
        method: "GET",
        flashError: true,
      }),
    }),
    updateNotification: build.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: endpointNotificationsManagement.UPDATE_NOTIFICATION.replace(":id", id),
        method: "PUT",
        body: data,
        flashError: true,
      }),
    }),
    createNotification: build.mutation<any, { data: any }>({
      query: ({ data }) => ({
        url: endpointNotificationsManagement.CREATE_NOTIFICATION,
        method: "POST",
        body: data,
        flashError: true,
      }),
    }),
    deleteNotification: build.mutation<any, { id: string }>({
      query: ({ id }) => ({
        url: endpointNotificationsManagement.DELETE_NOTIFICATION.replace(":id", id),
        method: "DELETE",
        flashError: true,
      }),
    }),
    searchUsers: build.query<any, { email: string; username: string }>({
      query: (params) => ({
        url: endpointNotificationsManagement.GET_ALL_USER_WITH_USERNAME_OR_EMAIL,
        params: params,
        method: "GET",
        flashError: true,
      }),
    }),
    sendEmail: build.mutation<any, { to: string; subject: string; html?: string }>({
      query: ({ to, subject, html }) => ({
        url: endpointNotificationsManagement.SEND_EMAIL,
        method: "POST",
        body: { to, subject,  html },
        flashError: true,
      }),
    }),
    getAllNotificationByUserId:build.query<any, { id: string,status:string }>({
      query: ({ id,status }) => ({
        url: endpointNotificationsManagement.GET_ALL_NOTIFICATIONS_BY_USER_ID.replace(":id", id).replace(":status",status),
        method: "GET",
        flashError: true,
      }),
    }),
    markNotificationAsRead: build.mutation<any, { id: string; userId: string;}>({
      query: ({ id, userId }) => ({
        url: endpointNotificationsManagement.MARK_NOTIFICATION_AS_READ.replace(":id", id),
        method: "PUT",
        body: { userId },
        flashError: true,
      }),
    }),
    updateStatus: build.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: endpointNotificationsManagement.UPDATE_STATUS.replace(":id", id),
        method: "PUT",
        body: data,
        flashError: true,
      }),
    }),

  }),

});

export const {
  useGetAllNotificationsWithPaginationQuery,
  useGetNotificationByIdQuery,
  useUpdateNotificationMutation,
  useCreateNotificationMutation,
  useDeleteNotificationMutation,
  useSearchUsersQuery,
  useSendEmailMutation, 
  useGetAllNotificationByUserIdQuery,
  useMarkNotificationAsReadMutation,
  useUpdateStatusMutation
} = notificationAPI;
