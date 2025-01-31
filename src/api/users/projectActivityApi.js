import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const activityApi = createApi({
  reducerPath: "activityApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_KEY, // API base URL from environment variable
    prepareHeaders: (headers) => {
      const token = sessionStorage.getItem("token"); // Retrieve token from sessionStorage
      if (token) {
        headers.set("Authorization", `Bearer ${token}`); // Attach Authorization header
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Create Activity (POST request)
    createActivity: builder.mutation({
      query: (activityData) => ({
        url: "activity_module/create_activity",
        method: "POST",
        body: {
          solar_or_wind: activityData.solarOrWind,
          activity_name: activityData.activityName,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    // Get Activities (GET request)
    getActivities: builder.query({
      query: () => ({
        url: "activity_module/get_activity",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),

    // Update Activity (PUT request)
    updateActivity: builder.mutation({
      query: ({ id, activityData }) => ({
        url: `activity_module/update_activity/${id}`, // Dynamic ID in URL
        method: "PUT",
        body: {
          solar_or_wind: activityData.solarOrWind,
          activity_name: activityData.activityName,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
  }),
});

export const { 
  useCreateActivityMutation, 
  useGetActivitiesQuery, 
  useUpdateActivityMutation 
} = activityApi;
