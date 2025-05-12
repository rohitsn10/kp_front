import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const electricityApi = createApi({
  reducerPath: "electricityApi",
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
    getElectricityLines: builder.query({
      query: () => ({
        url: "project_module/electricity",
        method: "GET",
      }),
    }),
    createElectricityLine: builder.mutation({
      query: (inputValue) => ({
        url: "project_module/electricity",
        method: "POST",
        body: {
          electricity_line: inputValue,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    updateElectricityLine: builder.mutation({
      query: ({ id, line }) => ({
        url: `project_module/electricity/${id}`,
        method: "PUT",
        body: {
          electricity_line: line,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    deleteElectricityLine: builder.mutation({
      query: (id) => ({
        url: `project_module/electricity/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

export const {
  useGetElectricityLinesQuery,
  useCreateElectricityLineMutation,
  useUpdateElectricityLineMutation,
  useDeleteElectricityLineMutation,
} = electricityApi;
