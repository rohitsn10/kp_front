import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const qualityApi = createApi({
  reducerPath: "qualityApi",
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
    createRfi: builder.mutation({
      query: (rfiData) => ({
        url: "quality_inspection/create_rfi",
        method: "POST",
        body: rfiData,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    createRfiInspectionOutcome: builder.mutation({
        query: (inspectionData) => ({
          url: "quality_inspection/create_rfi_inspection_outcome",
          method: "POST",
          body: inspectionData,
          headers: {
            "Content-Type": "application/json",
          },
        }),
      }),
    getRfi: builder.query({
      query: (projectId) => ({
        url: `quality_inspection/create_rfi/?project_id=${projectId}`,
        method: "GET",
      }),
    }),
    getElectricalRfi: builder.query({
      query: (id) => ({
        url: `quality_inspection/electrical_get_rfi/${id}`,
        method: "GET",
      }),
    }),
    getMechanicalRfi: builder.query({
      query: (id) => ({
        url: `quality_inspection/mechanical_get_rfi/${id}`,
        method: "GET",
      }),
    }),
    getCivilRfi: builder.query({
      query: (id) => ({
        url: `quality_inspection/civil_get_rfi/${id}`,
        method: "GET",
      }),
    }),
    uploadFilesInspectionOutcome: builder.mutation({
        query: (formData) => ({
          url: "quality_inspection/create_files_upload_inspection_outcome",
          method: "POST",
          body: formData,
          formData: true, // This tells RTK Query not to JSON stringify the body
        }),
      }),
  }),
});

export const { 
  useCreateRfiMutation, 
  useCreateRfiInspectionOutcomeMutation,
  useGetRfiQuery,
  useGetElectricalRfiQuery,
  useGetMechanicalRfiQuery,
  useGetCivilRfiQuery,
  useUploadFilesInspectionOutcomeMutation
} = qualityApi;