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
      query: (locationId) => {
        // Validate locationId is provided and valid
        if (!locationId || isNaN(locationId)) {
          throw new Error('Valid location ID is required');
        }
        
        // Return the endpoint with the locationId parameter
        return {
          url: `annexures_module/get_fire_extinguisher_inspection/${locationId}`,
          method: "GET",
        };
      },
      // Transform the response to handle the nested data structure
      transformResponse: (response) => {
        // If response is already in the expected format, return it
        if (response && typeof response === 'object') {
          // Check if we need to extract data from the wrapper
          if (response.status === true && response.data) {
            // Log for debugging
            console.log('Transforming API response:', response);
            return response;
          }
          return response;
        }
        
        // Handle unexpected response format
        console.error('Unexpected response format:', response);
        return { status: false, message: 'Invalid response format', data: [] };
      },
      // Add proper error handling
      transformErrorResponse: (response, meta, arg) => {
        console.error('Error in fire extinguisher inspections query:', response);
        return response;
      },
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