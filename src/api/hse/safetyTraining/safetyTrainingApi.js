import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const safetyTrainingApi = createApi({
  reducerPath: "safetyTrainingApi",
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
    // GET endpoint
    getSafetyTrainingAttendance: builder.query({
      query: (locationId) => `annexures_module/get_safety_training_attendance/${locationId}`,
    }),

    // POST endpoint
    createSafetyTrainingAttendance: builder.mutation({
      query: (body) => ({
        url: `annexures_module/create_safety_training_attendance`, // adjust if your API path differs
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useGetSafetyTrainingAttendanceQuery,
  useCreateSafetyTrainingAttendanceMutation,
} = safetyTrainingApi;
