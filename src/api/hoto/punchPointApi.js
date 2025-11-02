import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const punchPointApi = createApi({
  reducerPath: "punchPointApi",
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
    // Endpoint for creating punch point (first curl)
    createPunchPoint: builder.mutation({
      query: (formData) => ({
        url: "hoto_module/raise_punch_points",
        method: "POST",
        body: formData,
        formData: true, // Important for file uploads
      }),
    }),
    // Endpoint for submitting completed punch points (second curl)
    submitCompletedPunchPoint: builder.mutation({
      query: (formData) => ({
        url: "hoto_module/completed_punch_points",
        method: "POST",
        body: formData,
        formData: true,
      }),
    }),
    // Endpoint for verifying completed punch points (third curl)
    verifyCompletedPunchPoint: builder.mutation({
      query: ({ id, formData }) => ({
        url: `hoto_module/verify_completed_punch_points/${id}`,
        method: "PUT",
        body: formData,
        formData: true,
      }),
    }),
    // Endpoint for getting punch point details (fourth curl)
    getAllPunchPointDetails: builder.query({
      query: (hotoId) => {
        // Validate the hotoId parameter
        if (!hotoId || isNaN(hotoId)) {
          throw new Error('Valid HOTO ID is required');
        }
        
        return {
          url: `hoto_module/get_all_object_wise_punch_raise_completed_verify`,
          method: "GET",
          params: { hoto_id: hotoId },
        };
      },
      // Add proper error handling
      transformErrorResponse: (response) => {
        console.error('Error in punch point details query:', response);
        return response;
      },
    }),
  }),
});

export const {
  useCreatePunchPointMutation,
  useSubmitCompletedPunchPointMutation,
  useVerifyCompletedPunchPointMutation,
  useGetAllPunchPointDetailsQuery,
} = punchPointApi;