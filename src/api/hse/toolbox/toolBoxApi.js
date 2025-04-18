import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const toolTalkAttendanceApi = createApi({
  reducerPath: "toolTalkAttendanceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_KEY,
    prepareHeaders: (headers) => {
      const token = sessionStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      // Don't set Content-Type here as it conflicts with FormData
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createToolTalkAttendance: builder.mutation({
      query: (formData) => ({
        url: "annexures_module/create_tooltalk_attendence",
        method: "POST",
        body: formData,
        // Don't set Content-Type, it will be set automatically with correct boundary for FormData
        formData: true,
      }),
    }),
    getToolTalkAttendance: builder.query({
      query: (locationId) => {
        // Handle the case where locationId might be undefined or null
        if (!locationId) {
          // You might throw an error or return a specific URL for this case
          throw new Error('Location ID is required');
        }
        return {
          url: `annexures_module/location_wise_get_tooltalk_attendence/${locationId}`,
          method: "GET",
        };
      },
      transformErrorResponse: (response, meta, arg) => {
        console.error('Error in toolbox talk query:', response);
        return response;
      },

      transformResponse: (response, meta, arg) => {

        return response;
      },
    }),
  }),
});

export const {
  useCreateToolTalkAttendanceMutation,
  useGetToolTalkAttendanceQuery,
} = toolTalkAttendanceApi;