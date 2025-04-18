import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const fireExtinguisherInspectionApi = createApi({
  reducerPath: "fireExtinguisherInspectionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_KEY,
    prepareHeaders: (headers) => {
      const token = sessionStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      // Don't set Content-Type here, it will be set automatically for multipart/form-data
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Endpoint for creating fire extinguisher inspection
    createFireExtinguisherInspection: builder.mutation({
      query: (formData) => ({
        url: "annexures_module/create_fire_extinguisher_inspection",
        method: "POST",
        body: formData,
      }),
    }),
    
    // Endpoint for getting all fire extinguisher inspections
    getAllFireExtinguisherInspections: builder.query({
      query: () => ({
        url: `annexures_module/get_fire_extinguisher_inspection/${locationId}`,
        method: "GET",
      }),
    }),
    
    // Endpoint for getting site-specific fire extinguisher inspections
    getSiteFireExtinguisherInspections: builder.query({
      query: (siteId) => ({
        url: `annexures_module/get_site_fire_extinguisher_inspection/${siteId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateFireExtinguisherInspectionMutation,
  useGetAllFireExtinguisherInspectionsQuery,
  useGetSiteFireExtinguisherInspectionsQuery,
} = fireExtinguisherInspectionApi;