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
      query: () => ({
        url: "annexures_module/get_first_aid_record",
        method: "GET",
      }),
    }),
    
    // Endpoint for getting location-wise first aid records (the second curl)
    getLocationWiseFirstAidRecords: builder.query({
      query: (locationId) => ({
        url: `annexures_module/get_location_wise_first_aid_record/${locationId}`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useCreateFirstAidRecordMutation,
  useGetAllFirstAidRecordsQuery,
  useGetLocationWiseFirstAidRecordsQuery,
} = firstAidRecordApi;