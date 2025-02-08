import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Create the multipleActivityApi for managing sub-sub activities
export const multipleActivityApi = createApi({
  reducerPath: "multipleActivityApi",
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
    // Create Sub-Sub Activity (POST request)
    createSubSubActivity: builder.mutation({
      query: (data) => ({
        url: "activity_module/create_sub_sub_activity", // The endpoint for creating sub-sub activity
        method: "POST",
        body: {
          project_activity_id: data.projectActivityId, // Add project_activity_id as passed in the body
          sub_activity_id: data.subActivityId, // Add sub_activity_id from data
          sub_sub_activity_names: data.subSubActivityNames, // Array of sub-sub activity names
        },
        headers: {
          "Content-Type": "application/json", // Set the content type to application/json
        },
      }),
    }),

    // Get Sub-Sub Activities (GET request)
    getSubSubActivity: builder.query({
      query: (data) => ({
        url: "activity_module/get_sub_sub_activity",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    updateSubSubActivity: builder.mutation({
      query: ({ id, subSubActivityName }) => ({
        url: `activity_module/update_sub_sub_activity/${id}`,
        method: "PUT",
        body: {
          sub_sub_activity_name: subSubActivityName,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    deleteSubSubActivity: builder.mutation({
      query: ({ id }) => ({
        url: `activity_module/update_sub_sub_activity/${id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }),
    getSubSubActivityDropdown: builder.query({
      query: (subActivityId) => ({
        url: `activity_module/get_sub_sub_activity?sub_activity_id=${subActivityId}`, 
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }),
    }), 
    getMultipleSubSubActivities: builder.mutation({
      query: (subActivityIds) => ({
        url: "activity_module/multiplte_id_wise_listing_sub_sub_activitys",
        method: "POST",
        body: {
          sub_activity_ids: subActivityIds, // Pass an array of sub-activity IDs
        },
      }),
    }),
  }),
});

export const {
  useCreateSubSubActivityMutation, // Hook for creating sub-sub activities
  useGetSubSubActivityQuery,
  useUpdateSubSubActivityMutation,
  useDeleteSubSubActivityMutation,
  useGetSubSubActivityDropdownQuery,
  useGetMultipleSubSubActivitiesMutation 
  // Hook for fetching sub-sub activities
} = multipleActivityApi;
