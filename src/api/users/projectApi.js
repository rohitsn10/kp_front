import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const projectApi = createApi({
  reducerPath: "projectApi",
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

    createMainProject: builder.mutation({
      query: (formData) => ({
        url: "project_module/create_main_project",
        method: "POST",
        body: formData,
      }),
    }),

    getMainProjects: builder.query({
      query: () => ({
        url: "project_module/create_main_project",
        method: "GET",
      }),
    }),

    updateMainProject: builder.mutation({
      query: (data) => ({
        url: `project_module/create_main_project/${data.id}`,
        method: "PUT",
        body: data,
      }),
    }),

    deleteMainProject: builder.mutation({
      query: (id) => ({
        url: `project_module/create_main_project/${id}`,
        method: "DELETE",
      }),
    }),
    getProjectDataById: builder.query({
      query: (projectId) => ({
        url: `project_module/project_id_wise_get_project_data/${projectId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateMainProjectMutation,
  useGetMainProjectsQuery,
  useUpdateMainProjectMutation,
  useDeleteMainProjectMutation,
  useGetProjectDataByIdQuery
} = projectApi;
