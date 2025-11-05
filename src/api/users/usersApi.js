import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_KEY,
    prepareHeaders: (headers) => {
      const token = sessionStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      // headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchUsers: builder.query({
      query: () => ({
        url: "user_profile/user_create",
        method: "GET",
      }),
      providesTags: ["Users"],
      transformResponse: (response) => response.data || [],
    }),
      getUserByNames: builder.query({
      query: ({ name, page = 1, page_size }) => ({
        url: "user_profile/get_user_by_names/",
        method: "GET",
        params: {
          name,
          page,
          ...(page_size && { page_size }),
        },
      }),
      providesTags: ["Users"],
      // Handle paginated response
      transformResponse: (response) => {
        // If paginated response
        if (response.results) {
          return {
            users: response.results,
            count: response.count,
            next: response.next,
            previous: response.previous,
          };
        }
        // If non-paginated response (fallback)
        return {
          users: response.data || [],
          count: response.data?.length || 0,
          next: null,
          previous: null,
        };
      },
    }),
    createUser: builder.mutation({
      query: (userData) => ({
        url: "user_profile/user_create",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: [{ type: "Users", id: "LIST" }],
    }),
    updateUser: builder.mutation({
      query: ({ userId, formData }) => ({
        url: `user_profile/admin_can_update_user/${userId}`,
        method: "PUT",
        body: formData,
      }),
    }),
    updateUserStatus: builder.mutation({
      query: ({ userId }) => ({
        url: `user_profile/user_activate_or_deactivate/${userId}`,
        method: "PUT",
      }),
    }),
    updateUserPassword: builder.mutation({
      query: ({ userId, password }) => {
        const formData = new FormData();
        formData.append("password", password); // Add password to FormData

        return {
          url: `/user_profile/admin_can_reset_passowrd/${userId}`,
          method: "PUT",
          body: formData, // Send FormData in the request body
        };
      },
    }),
    fetchDepartment: builder.query({
      query: (departmentName) => ({
        url: "user_profile/create_get_department",
        method: "GET",
        params: departmentName
          ? { department_name: departmentName }
          : undefined,
      }),
    }),
    assignUserAllThings: builder.mutation({
      query: (formData) => ({
        url: "user_profile/assign_user_all_things",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Users"],
    }),
    getUserAllThings: builder.query({
      query: (userId) => ({
        url: "user_profile/assign_user_all_things",
        method: "GET",
        params: { user_id: userId },
      }),
      providesTags: (result, error, userId) => [{ type: "Users", id: userId }],
    }),
    createDepartment: builder.mutation({
      query: (departmentName) => {
        const formData = new FormData();
        formData.append("department_name", departmentName);

        return {
          url: "user_profile/create_get_department",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["Departments"],
    }),
  }),
});

export const {
  useFetchUsersQuery,
  useGetUserByNamesQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useUpdateUserStatusMutation,
  useUpdateUserPasswordMutation,
  useFetchDepartmentQuery,
  useAssignUserAllThingsMutation,
  useGetUserAllThingsQuery,
  useCreateDepartmentMutation,
} = userApi;
