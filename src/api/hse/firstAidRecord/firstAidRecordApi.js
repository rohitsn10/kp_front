import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const firstAidRecordApi = createApi({
  reducerPath: "firstAidRecordApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_KEY,
    prepareHeaders: (headers) => {
      const token = sessionStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      // Not setting Content-Type here since we're using FormData for file uploads
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Endpoint for creating first aid record
    createFirstAidRecord: builder.mutation({
      query: (formData) => ({
        url: "annexures_module/create_first_aid_record",
        method: "POST",
        body: formData,
        formData: true, // Important for file uploads
      }),
    }),
    
    // Endpoint for getting all first aid records (the third curl)
    getAllFirstAidRecords: builder.query({
      query: (locationId) => ({
        url: `annexures_module/get_first_aid_record/${locationId}`,
        method: "GET",
      }),
    }),
    
    // Endpoint for getting location-wise first aid records (the second curl)
    getLocationWiseFirstAidRecords: builder.query({
      query: (locationId) => {
        // Validate the locationId parameter
        if (!locationId || isNaN(locationId)) {
          throw new Error('Valid location ID is required');
        }
        
        // Return the API endpoint with valid locationId
        return {
          url: `annexures_module/get_location_wise_first_aid_record/${locationId}`,
          method: "GET",
        };
      },
      // Add proper error handling
      transformErrorResponse: (response, meta, arg) => {
        console.error('Error in first aid records query:', response);
        return response;
      },
    }),
  }),
});

export const {
  useCreateFirstAidRecordMutation,
  useGetAllFirstAidRecordsQuery,
  useGetLocationWiseFirstAidRecordsQuery,
} = firstAidRecordApi;