import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const suggestionSchemeReportApi = createApi({
  reducerPath: "suggestionSchemeReportApi",
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
    // Endpoint for creating suggestion scheme report
    createSuggestionSchemeReport: builder.mutation({
      query: (formData) => ({
        url: "annexures_module/create_suggestion_scheme_report",
        method: "POST",
        body: formData,
        formData: true, // Important for handling the evaluator_signature file upload
      }),
    }),
    
    // Endpoint for getting suggestion scheme reports by location
    getSuggestionSchemeReports: builder.query({
      query: (locationId) => {
        // Validate the locationId parameter
        if (!locationId || isNaN(locationId)) {
          throw new Error('Valid location ID is required');
        }
        
        return {
          url: `annexures_module/get_suggestion_scheme_report/${locationId}`,
          method: "GET",
        };
      },
      // Add proper error handling
      transformErrorResponse: (response, meta, arg) => {
        console.error('Error in suggestion scheme reports query:', response);
        return response;
      },
    }),
  }),
});

export const {
  useCreateSuggestionSchemeReportMutation,
  useGetSuggestionSchemeReportsQuery,
} = suggestionSchemeReportApi;