import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const masterDesignApi = createApi({
  reducerPath: "masterDesignApi",
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
    createDrawing: builder.mutation({
      query: (formData) => ({
        url: "project_module/add_drawing_and_design",
        method: "POST",
        body: formData,
      }),
    }),
    getAllDrawings: builder.query({
      query: () => ({
        url: "project_module/get_drawing_and_design",
        method: "GET",
      }),
    }),
    updateDrawing: builder.mutation({
      query: ({ drawingId, formData }) => ({
        url: `project_module/update_drawing_and_design/${drawingId}`,
        method: "PUT",
        body: formData,
      }),
    }),
    getDrawingsByProjectId: builder.query({
      query: (projectId) => ({
        url: `project_module/projcet_idwise_get_drawing_and_design/${projectId}`,
        method: "GET",
      }),
    }),
    getDrawingById: builder.query({
      query: (drawingId) => ({
        url: `project_module/drawing_id_wise_get_drawing_and_design/${drawingId}`,
        method: "GET",
      }),
    }),
    approvalOrCommentOnDrawing: builder.mutation({
      query: ({ drawingId, formData }) => ({
        url: `project_module/approval_or_commented_action_on_drawing_and_design/${drawingId}`,
        method: "PUT",
        body: formData,
      }),
    }),
  }),
});

export const {
  useCreateDrawingMutation,
  useGetAllDrawingsQuery,
  useUpdateDrawingMutation,
  useGetDrawingsByProjectIdQuery,
  useGetDrawingByIdQuery,
  useApprovalOrCommentOnDrawingMutation
} = masterDesignApi;
