import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const permissionsApi = createApi({
  reducerPath: "permissionsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_KEY,
    prepareHeaders: (headers) => {
      const token = sessionStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getPermissionsByGroupId: builder.query({
      query: (groupId) => `user_profile/group_id_wise_permission_list?group_id=${groupId}`,
    }),
    getAllPermissions: builder.query({
      query: () => `user_profile/permission_list`,
    }),
    getAllGroups: builder.query({
      query: () => `user_profile/group_create_with_permissions`,
    }),
    createGroupWithPermissions: builder.mutation({
      query: (groupData) => ({
        url: "user_profile/group_create_with_permissions",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: groupData,
      }),
    }),
    deleteGroup: builder.mutation({
      query: (groupId) => ({
        url: `user_profile/group_delete/${groupId}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

export const {
  useGetPermissionsByGroupIdQuery,
  useGetAllPermissionsQuery,
  useGetAllGroupsQuery,
  useCreateGroupWithPermissionsMutation,
  useDeleteGroupMutation,
} = permissionsApi;
