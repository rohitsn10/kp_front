import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_KEY,
    prepareHeaders: (headers) => {
      const token = sessionStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      // headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchUsers: builder.query({
      query: () => ({
        url: 'user_profile/user_create',
        method: 'GET',
      }),
      providesTags: ['Users'],
      transformResponse: (response) => response.data || [],
    }),
    createUser: builder.mutation({
      query: (userData) => ({
        url: 'user_profile/user_create',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: [{ type: 'Users', id: 'LIST' }],
    }),
    updateUser: builder.mutation({
      query: ({ userId, formData }) => 
        ({
        url: `user_profile/admin_can_update_user/${userId}`,
        method: 'PUT',
        body: formData,
      }),
            
    }),
    updateUserStatus:builder.mutation({
      query:({userId})=>({
        url: `user_profile/user_activate_or_deactivate/${userId}`,
        method: 'PUT',
      })
    })
  }),
});

export const { useFetchUsersQuery, useCreateUserMutation,useUpdateUserMutation,useUpdateUserStatusMutation } = userApi;
