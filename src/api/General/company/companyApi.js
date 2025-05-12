import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const companyApi = createApi({
  reducerPath: "companyApi",
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
    getCompanies: builder.query({
      query: () => ({
        url: "project_module/company", 
        method: "GET",
      }),
    }),
    createCompany: builder.mutation({
      query: (companyInput) => ({
        url: "project_module/company",
        method: "POST",
        body: {
          company_name:companyInput,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    updateCompany: builder.mutation({
      query: ({ id, name }) => ({
        url: `project_module/company/${id}`,
        method: "PUT",
        body: {
          company_name: name,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    deleteCompany: builder.mutation({
      query: (id) => ({
        url: `project_module/company/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

export const {
  useGetCompaniesQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
} = companyApi;
