import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const documentApi = createApi({
  reducerPath: "documentApi",
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
    createDocument: builder.mutation({
      query: (formData) => ({
        url: "document_control/document_management",
        method: "POST",
        body: formData, 
      }),
    }),
    getDocuments: builder.query({
      query: () => ({
        url: "document_control/document_management", 
        method: "GET",
      }),
    }),
    updateDocument: builder.mutation({
      query: ({ documentId, formData }) => ({
        url: `document_control/document_management/${documentId}`, // Dynamic URL with document ID
        method: "PUT",
        body: formData,
      }),
    }),
  }),
});

export const { useCreateDocumentMutation, useGetDocumentsQuery,useUpdateDocumentMutation } = documentApi;
