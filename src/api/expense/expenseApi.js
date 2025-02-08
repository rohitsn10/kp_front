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
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createExpense: builder.mutation({
      query: (expenseData) => {
        const formData = new FormData();
        formData.append("project_id", expenseData.project_id);
        formData.append("category_id", expenseData.category_id);
        formData.append("expense_name", expenseData.expense_name);
        formData.append("expense_amount", expenseData.expense_amount);
        formData.append("notes", expenseData.notes);
        if (expenseData.expense_document_attachments) {
          formData.append(
            "expense_document_attachments",
            expenseData.expense_document_attachments
          );
        }

        return {
          url: "project_module/create_expense_data",
          method: "POST",
          body: formData,
        };
      },
    }),
    getExpenses: builder.query({
        query: (projectId) => {
          return {
            url: `project_module/create_expense_data?project_id=${projectId}`,
            method: "GET",
          };
        },
      }),
  }),
});

export const { useCreateExpenseMutation,useGetExpensesQuery  } = expenseApi;
