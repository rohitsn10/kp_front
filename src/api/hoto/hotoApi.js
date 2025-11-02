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
  query: ({ projectId, documentId, remarks }) => {
    // Validate the projectId parameter
    if (!projectId || isNaN(projectId)) {
      throw new Error('Valid project ID is required');
    }
    
    // Validate the documentId parameter
    if (!documentId || isNaN(documentId)) {
      throw new Error('Valid document ID is required');
    }
    
    return {
      url: `hoto_module/add_remarks_to_document/${projectId}`,
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        document_id: documentId,
        remarks: remarks
      },
    };
  },
}),

    // Endpoint for uploading additional documents
uploadDocument: builder.mutation({
  query: ({ projectId, categoryId, documentId, formData }) => {
    // Validate required parameters
    if (!projectId || isNaN(projectId)) {
      throw new Error('Valid project ID is required');
    }
    if (!categoryId || isNaN(categoryId)) {
      throw new Error('Valid category ID is required');
    }
    if (!documentId || isNaN(documentId)) {
      throw new Error('Valid document ID is required');
    }
    
    // Append IDs to formData
    formData.append('project_id', projectId);
    formData.append('category_id', categoryId);
    formData.append('document_id', documentId);
    
    return {
      url: `hoto_module/upload_document/${projectId}`,
            // url: `hoto_module/upload_main_document`,

      method: "PUT",
      body: formData,
      formData: true, // Important for file uploads
    };
  },
}),

    // Endpoint for verifying a document
verifyDocument: builder.mutation({
  query: ({ projectId, documentId, status, verifyComment }) => {
    // Validate the projectId parameter
    if (!projectId || isNaN(projectId)) {
      throw new Error('Valid project ID is required');
    }
    
    // Validate the documentId parameter
    if (!documentId || isNaN(documentId)) {
      throw new Error('Valid document ID is required');
    }
    
    // Validate status
    if (!status || !["Verified", "Rejected", "Pending"].includes(status)) {
      throw new Error('Valid status is required (Verified, Rejected, or Pending)');
    }
    
    return {
      url: `hoto_module/verify_document/${projectId}`,
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        document_id: documentId,
        status: status,
        verify_comment: verifyComment
      },
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
      query: ({projectId}) => ({
        url: `hoto_module/fetch_all_documents_names/${projectId}`,
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
    // Add this inside the endpoints builder, after your other endpoints
deleteDocument: builder.mutation({
  query: ({ projectId, documentIds }) => {
    // Validate the projectId parameter
    if (!projectId || isNaN(projectId)) {
      throw new Error('Valid project ID is required');
    }
    
    // Validate the documentIds parameter
    if (!documentIds || !Array.isArray(documentIds) || documentIds.length === 0) {
      throw new Error('Valid document IDs array is required');
    }
    
    return {
      url: `hoto_module/delete_document/${projectId}`,
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        document_id: documentIds
      },
    };
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
  useFetchallHotoDocumentsQuery,
  useDeleteDocumentMutation  
} = hotoApi;