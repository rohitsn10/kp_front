import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const qualitySupplyApi = createApi({
  reducerPath: "qualitySupplyApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_KEY,
    prepareHeaders: (headers) => {
      const token = sessionStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      // headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Endpoint for creating quality inspection items
    createQualityItems: builder.mutation({
      query: (itemData) => ({
        url: "quality_inspection/create_items/",
        method: "POST",
        body: itemData,
      }),
    }),
    listAllItems: builder.query({
      query: () => ({
        url: "quality_inspection/list_all_items",
        method: "GET",
      }),
    }),
    setProjectItems: builder.mutation({
      query: (itemData) => ({
        url: "quality_inspection/active_items",
        method: "PUT",
        body: itemData,
      }),
    }),
    getItemsByProject: builder.query({
      query: (id) => ({
        url: `quality_inspection/list_items/${id}`,
        method: "GET",
      }),
    }),
    generateInspectionCallReport: builder.mutation({
      query: ({ id, data }) => ({
        url: `quality_inspection/inspection_call_report_pdf/${id}`,
        method: "POST",
        body: data,
      }),
    }),
    uploadQualityInspectionDocuments: builder.mutation({
      query: (formData) => ({
        url: "quality_inspection/quality_inspection_document_upload",
        method: "POST",
        body: formData,
        formData: true,
      }),
    }),
    createQualityInspectionObservationReport: builder.mutation({
      query: (formData) => ({
        url: "quality_inspection/create_quality_inspection_observation_report",
        method: "POST",
        body: formData,
        formData: true,
      }),
    }),
    getQualityInspectionDocumentList: builder.query({
      query: ({ itemId, projectId }) => ({
        url: `quality_inspection/quality_inspection_document_list/${itemId}/${projectId}`,
        method: "GET",
      }),
    }),
    getQualityInspectionObservationReport: builder.query({
      query: ({ itemId, projectId }) => ({
        url: `quality_inspection/get_quality_inspection_observation_report/${itemId}/${projectId}`,
        method: "GET",
      }),
    }),
    generateMdccReportPdf: builder.mutation({
      query: ({ itemId, data }) => ({
        url: `quality_inspection/mdcc_report_pdf/${itemId}`,
        method: "POST",
        body: data, // expected to contain project_id or similar
      }),
    }),
    
  }),
});

export const {
  useCreateQualityItemsMutation,
  useListAllItemsQuery,
  useSetProjectItemsMutation,
  useGetItemsByProjectQuery,
  useGenerateInspectionCallReportMutation,
  useUploadQualityInspectionDocumentsMutation,
  useCreateQualityInspectionObservationReportMutation,
  useGetQualityInspectionDocumentListQuery,
  useGetQualityInspectionObservationReportQuery,
  useGenerateMdccReportPdfMutation,
} = qualitySupplyApi;
