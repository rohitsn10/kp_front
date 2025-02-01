import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const subActivityApi = createApi({
  reducerPath: "subActivityApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_KEY, // Use your API base URL here
    prepareHeaders: (headers) => {
      const token = sessionStorage.getItem("token"); // Get the token from session storage
      if (token) {
        headers.set("Authorization", `Bearer ${token}`); // Set the Authorization header
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Create Sub-Activity (POST request)
    createSubActivity: builder.mutation({
      query: (subActivityData) => ({
        url: "activity_module/create_sub_activity", // Endpoint for creating sub-activity
        method: "POST",
        body: {
          project_activity_id: subActivityData.projectActivityId, // Add the project_activity_id field
          sub_activity_names: subActivityData.subActivityNames, // Add sub_activity_names array
        },
        headers: {
          "Content-Type": "application/json", // Set the content type to application/json
        },
      }),
    }),

    // Get Sub-Activities (GET request)
    getSubActivities: builder.query({
      query: () => ({
        url: "activity_module/get_sub_activity", // Endpoint to get sub-activities
        method: "GET",
      }),
    }),
    updateSubActivity: builder.mutation({
        query: ({ id, subActivityNames }) => 
          ({
          url: `activity_module/update_sub_activity/${id}`, // Endpoint for updating sub-activity
          method: "PUT",
          body: {
            name: subActivityNames, // The new sub-activity names array
          },
          // headers: {
          //   "Content-Type": "application/json", // Set the content type to application/json
          // },
        }),
      }),
      deleteSubActivity: builder.mutation({
        query: (id) => ({
          url: `activity_module/update_sub_activity/${id}`, // Endpoint for deleting sub-activity
          method: "DELETE",
        }),
      }),
      getDropdownSubActivities: builder.query({
        query: (activityId) => ({
          url: `activity_module/dropdown_get_sub_activity/${activityId}`, // Endpoint for fetching sub-activities based on activity ID
          method: "GET",
        }),
      }),
  }),
});

export const {
  useCreateSubActivityMutation, // Hook to call the create sub-activity mutation
  useGetSubActivitiesQuery,useUpdateSubActivityMutation,
  useDeleteSubActivityMutation,
  useGetDropdownSubActivitiesQuery
  // Hook to get sub-activities list
} = subActivityApi;
