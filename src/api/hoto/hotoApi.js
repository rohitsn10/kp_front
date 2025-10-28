import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const hotoApi = createApi({
  reducerPath: "hotoApi",
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
    // Endpoint for uploading main document
    uploadMainDocument: builder.mutation({
      query: (formData) => ({
        url: "hoto_module/upload_main_document",
        method: "POST",
        body: formData,
        formData: true, // Important for file uploads
      }),
    }),
    
    // Endpoint for viewing documents by project ID
    getDocumentsByProjectId: builder.query({
      query: (projectId) => {
        // Validate the projectId parameter
        if (!projectId || isNaN(projectId)) {
          throw new Error('Valid project ID is required');
        }
        
        return {
          url: `hoto_module/view_document/${projectId}`,
          method: "GET",
        };
      },
      // Add proper error handling
      transformErrorResponse: (response, meta, arg) => {
        console.error('Error in getting documents:', response);
        return response;
      },
    }),

    // Endpoint for adding remarks to a document
    addRemarksToDocument: builder.mutation({
      query: ({ documentId, remarksData }) => {
        // Validate the documentId parameter
        if (!documentId || isNaN(documentId)) {
          throw new Error('Valid document ID is required');
        }
        
        return {
          url: `hoto_module/add_remarks_to_document/${documentId}`,
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
          },
          body: remarksData,
        };
      },
    }),

    // Endpoint for uploading additional documents
    uploadDocument: builder.mutation({
      query: ({ documentId, formData }) => {
        // Validate the documentId parameter
        if (!documentId || isNaN(documentId)) {
          throw new Error('Valid document ID is required');
        }
        
        return {
          url: `hoto_module/upload_document/${documentId}`,
          method: "PUT",
          body: formData,
          formData: true, // Important for file uploads
        };
      },
    }),

    // Endpoint for verifying a document
    verifyDocument: builder.mutation({
      query: ({ documentId, verifyData }) => {
        // Validate the documentId parameter
        if (!documentId || isNaN(documentId)) {
          throw new Error('Valid document ID is required');
        }
        
        return {
          url: `hoto_module/verify_document/${documentId}`,
          method: "PUT",
          headers: {
            'Content-Type': 'application/json',
          },
          body: verifyData,
        };
      },
    }),
    generateHotoCertificate: builder.mutation({
  query: (certificateData) => ({
    url: "hoto_module/hoto_certificate",
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
    },
    body: certificateData,
  }),
}),
    fetchallHotoDocuments: builder.query({
      query: () => ({
        url: "hoto_module/fetch_all_documents_names",
        method: "GET",
      }),
      transformResponse: (response) => {
        // Optional: clean up / format data before returning
        return response
      },
      transformErrorResponse: (response) => {
        console.error("Error fetching all HOTO documents:", response);
        return response;
      },
    }),
  }),
});

export const {
  useUploadMainDocumentMutation,
  useGetDocumentsByProjectIdQuery,
  useAddRemarksToDocumentMutation,
  useUploadDocumentMutation,
  useVerifyDocumentMutation,
  useGenerateHotoCertificateMutation,
  useFetchallHotoDocumentsQuery
} = hotoApi;