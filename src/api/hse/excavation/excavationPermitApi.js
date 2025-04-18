import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const excavationPermitApi = createApi({
  reducerPath: "excavationPermitApi",
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
    // Endpoint for creating excavation permit
    createExcavationPermit: builder.mutation({
      query: (formData) => ({
        url: "annexures_module/create_excavationpermit",
        method: "POST",
        body: formData,
        formData: true, // Important for file uploads
      }),
    }),
    
    // Endpoint for getting location-specific excavation permits
    getLocationExcavationPermits: builder.query({
      query: (locationId) => ({
        url: `annexures_module/get_excavationpermit/${locationId}`,
        method: "GET",
      }),
    }),
    
    // Optional: Endpoint for getting all excavation permits
    getAllExcavationPermits: builder.query({
      query: () => ({
        url: "get_excavationpermit",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateExcavationPermitMutation,
  useGetLocationExcavationPermitsQuery,
  useGetAllExcavationPermitsQuery,
} = excavationPermitApi;