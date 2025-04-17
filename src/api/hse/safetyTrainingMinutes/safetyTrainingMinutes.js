import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const safetyTrainingMinutesApi = createApi({
  reducerPath: "safetyTrainingMinutesApi",
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
    // Endpoint for creating minutes of safety training
    createMinutesOfSafetyTraining: builder.mutation({
      query: (data) => ({
        url: "annexures_module/create_minutes_of_safety_training",
        method: "POST",
        body: data,
      }),
    }),
    
    // Endpoint for getting minutes of safety training by location
    getMinutesOfSafetyTraining: builder.query({
      query: (locationId) => ({
        url: `annexures_module/get_minutes_of_safety_training/${locationId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateMinutesOfSafetyTrainingMutation,
  useGetMinutesOfSafetyTrainingQuery,
} = safetyTrainingMinutesApi;