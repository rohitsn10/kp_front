import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const expenseApi = createApi({
  reducerPath: "expenseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_KEY,
    prepareHeaders: (headers) => {
      const token = sessionStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      // Remove Content-Type header for FormData
      headers.delete("Content-Type");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createExpense: builder.mutation({
      query: (formData) => ({
        url: "project_module/create_expense_data",
        method: "POST",
        body: formData,
        formData: true,
      }),
    }),
    getExpenses: builder.query({
      query: (projectId) => ({
        url: `project_module/create_expense_data?project_id=${projectId}`,
        method: "GET",
      }),
    }),
    updateExpense: builder.mutation({
      query: ({ id, data }) => ({
        url: `project_module/update_expense_data/${id}`,
        method: "PUT",
        body: data,
        formData: true,
      }),
      // Invalidate the getExpenses cache after successful update
      invalidates: (result, error, { id }) => [
        { type: 'Expenses' },
        { type: 'Expenses', id }
      ],
    }),
  }),
});

export const { useCreateExpenseMutation,useUpdateExpenseMutation, useGetExpensesQuery } = expenseApi;