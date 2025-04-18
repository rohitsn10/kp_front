import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const ladderInspectionApi = createApi({
  reducerPath: "ladderInspectionApi",
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
    // Endpoint for creating ladder inspection
    createLadderInspection: builder.mutation({
      query: (formData) => ({
        url: "annexures_module/create_ladder_inspection",
        method: "POST",
        body: formData,
        formData: true, // Important for handling the signature file upload
      }),
    }),
    
    // Endpoint for getting ladder inspections by location
    getLadderInspections: builder.query({
      query: (locationId) => {
        // Validate the locationId parameter
        if (!locationId || isNaN(locationId)) {
          throw new Error('Valid location ID is required');
        }
        
        return {
          url: `annexures_module/get_ladder_inspection/${locationId}`,
          method: "GET",
        };
      },
      // Add proper error handling
      transformErrorResponse: (response, meta, arg) => {
        console.error('Error in ladder inspection query:', response);
        return response;
      },
    }),
  }),
});

export const {
  useCreateLadderInspectionMutation,
  useGetLadderInspectionsQuery,
} = ladderInspectionApi;