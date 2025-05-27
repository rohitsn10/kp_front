import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const clientDataApi = createApi({
  reducerPath: "clientDataApi",
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
  tagTypes: ['ClientData'], // Add tag types for cache invalidation
  endpoints: (builder) => ({
    createClientData: builder.mutation({
      query: (formData) => ({
        url: "project_module/create_client_data",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ['ClientData'], // Invalidate cache after creating
    }),
    getClientData: builder.query({
      query: (id) => `project_module/project_id_wise_get_client_data/${id}`,
      providesTags: ['ClientData'], // Provide cache tags
    }),
    updateClientData: builder.mutation({
      query: ({ clientId, formData }) => ({
        url: `project_module/update_client_data/${clientId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ['ClientData'], // Invalidate cache after updating
    }),
    deleteClientData: builder.mutation({
      query: (clientId) => ({
        url: `project_module/update_client_data/${clientId}`,
        method: "DELETE",
      }),
      invalidatesTags: ['ClientData'], // Invalidate cache after deleting
    }),
  }),
});

export const { 
  useCreateClientDataMutation,
  useGetClientDataQuery,
  useUpdateClientDataMutation,
  useDeleteClientDataMutation
} = clientDataApi;