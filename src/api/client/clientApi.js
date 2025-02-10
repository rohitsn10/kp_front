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
  endpoints: (builder) => ({
    createClientData: builder.mutation({
      query: (formData) => ({
        url: "project_module/create_client_data",
        method: "POST",
        body: formData,
      }),
    }),
    getClientData: builder.query({
      query: (id) => `project_module/create_client_data?project_id=${id}`,
    }),
  }),
});

export const { useCreateClientDataMutation,useGetClientDataQuery  } = clientDataApi;
