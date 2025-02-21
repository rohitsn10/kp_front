import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const inspectionApi = createApi({
  reducerPath: "inspectionApi",
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
    addInspection: builder.mutation({
      query: (body) => ({
        url: "material_management/add_inspection_of_material",
        method: "POST",
        body,
      }),
    }),
    approveInspection: builder.mutation({
        query: ({ inspectionId, body }) => ({
          url: `material_management/approval_action_inspection/${inspectionId}`,
          method: "PUT",
          body,
        }),
      }),
      getInspectionByMaterialId: builder.query({
        query: (materialId) => ({
          url: `material_management/material_id_wise_get_inspection/${materialId}`,
          method: "GET",
        }),
      }),
  }),
});

export const { useAddInspectionMutation,useApproveInspectionMutation,useGetInspectionByMaterialIdQuery } = inspectionApi;
