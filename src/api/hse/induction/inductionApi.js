import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const inductionTrainingApi = createApi({
  reducerPath: "inductionTrainingApi",
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
    // Endpoint for creating induction training
    createInductionTraining: builder.mutation({
      query: (formData) => ({
        url: "annexures_module/create_induction_training",
        method: "POST",
        body: formData,
        formData: true, // Important for file uploads
      }),
    }),
    
    // Endpoint for getting all induction trainings
    getInductionTrainings: builder.query({
      query: (locationId) => ({
        url: locationId 
          ? `annexures_module/get_induction_training/${locationId}` 
          : "annexures_module/get_induction_training",
        method: "GET",
      }), 
    }),
    
    // Endpoint for getting location-wise induction trainings
    getLocationWiseInductionTrainings: builder.query({
      query: (locationId) => ({
        url: `annexures_module/get_location_wise_induction_training/${locationId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateInductionTrainingMutation,
  useGetInductionTrainingsQuery ,
  useGetLocationWiseInductionTrainingsQuery,
} = inductionTrainingApi;