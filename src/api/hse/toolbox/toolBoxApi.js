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
      query: (locationId) => ({
        url: `annexures_module/get_tooltalk_attendence/${locationId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateToolTalkAttendanceMutation,
  useGetToolTalkAttendanceQuery,
} = toolTalkAttendanceApi;