import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const milestoneApi = createApi({
  reducerPath: "milestoneApi",
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
    createMilestone: builder.mutation({
      query: (milestoneData) => ({
        url: "project_module/create_milestone",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: milestoneData,
      }),
    }),
    getMilestone: builder.query({
      query: (projectId) => `project_module/get_milestone?project_id=${projectId}`,
    }),
    getProductActivity: builder.query({
      query: (id) => `activity_module/main_project_wise_main_activity/${id}`,
    }),
    getProductSubActivity: builder.query({
      query: (id) => `activity_module/main_project_wise_sub_activity/${id}`,
    }),
    getProductSubSubActivity: builder.query({
      query: (id) => `activity_module/main_project_wise_sub_sub_activity/${id}`,
    }),
    getMilestoneById: builder.query({
      query: (milestoneId) => `project_module/milestone_id_wise_get_milestone/${milestoneId}`,
    }),
  }),
});

export const { 
  useCreateMilestoneMutation,
  useGetMilestoneQuery,
  useGetProductActivityQuery, 
  useGetProductSubActivityQuery, 
  useGetProductSubSubActivityQuery ,
  useGetMilestoneByIdQuery
} = milestoneApi;
