import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const permitToWorkApi = createApi({
  reducerPath: "permitToWorkApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_KEY,
    prepareHeaders: (headers) => {
      const token = sessionStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createPermitToWork: builder.mutation({
      query: (body) => ({
        url: "annexures_module/create_permit_to_work",
        method: "POST",
        body,
      }),
    }),
    getPermitToWork: builder.query({
      query: () => ({
        url: "annexures_module/get_permit_to_work",
        method: "GET", 
      }),
    }),
  }),
});

export const {
  useCreatePermitToWorkMutation,
  useGetPermitToWorkQuery,
} = permitToWorkApi;
