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
      headers.set("Content-Type", "application/json");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getSafetyTrainingAttendance: builder.query({
      query: () => "annexures_module/get_safety_training_attendance",
    }),
  }),
});

export const {
  useGetSafetyTrainingAttendanceQuery,
} = safetyTrainingApi;