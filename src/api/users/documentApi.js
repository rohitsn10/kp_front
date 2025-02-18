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
        url: `document_control/document_management_update/${documentId}`,
        method: "PUT",
        body: formData,
      }),
    }),
    deleteDocument: builder.mutation({
      query: ({ documentId }) => ({
        url: `document_control/document_management/${documentId}`,
        method: "DELETE",
      }),
    }),
    deleteUploadedDocument: builder.mutation({
      query: ({ documentId }) => ({
        url: `document_control/delete_document_files/${documentId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useCreateDocumentMutation,
  useGetDocumentsQuery,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
  useDeleteUploadedDocumentMutation,
} = documentApi;
