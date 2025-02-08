import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const projectWpoApi = createApi({
  reducerPath: "projectWpoApi",
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
    createProjectWpo: builder.mutation({
      query: (formData) => {
        const data = new FormData();
        data.append("project_id", formData.project_id);
        
        Object.keys(formData.files).forEach((key) => {
          formData.files[key].forEach((file) => {
            data.append(key, file);
          });
        });

        return {
          url: "project_module/create_wo_po_data",
          method: "POST",
          body: data,
        };
      },
    }),
    getProjectWpo: builder.query({
      query: (projectId) => ({
        url: `project_module/create_wo_po_data?project_id=${projectId}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useCreateProjectWpoMutation, useGetProjectWpoQuery } = projectWpoApi;