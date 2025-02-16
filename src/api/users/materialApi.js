import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const materialApi = createApi({
  reducerPath: "materialApi",
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
    // Create Material
    createMaterial: builder.mutation({
      query: (formData) => ({
        url: "material_management/material_management_create",
        method: "POST",
        body: formData,
      }),
    }),

    // Get Material List (assuming you have a GET endpoint for materials)
    getMaterials: builder.query({
      query: () => ({
        url: "material_management/material_management_create", // Make sure this is the correct endpoint
        method: "GET",
      }),
    }),

    // Update Material (assuming you have an endpoint for updating materials)
    // updateMaterial: builder.mutation({
    //   query: (data) => ({
    //     url: `material_management/material_management_update/${data.id}`, // Make sure this is the correct endpoint
    //     method: "PUT",
    //     body: data,
    //   }),
    // }),
    updateMaterial: builder.mutation({
      query: ({ id, formData }) => ({
        url: `material_management/material_management_update/${id}`,
        method: "PUT",
        body: formData,
        // Add this to properly handle FormData
        formData: true,
      }),
    }),
    deleteMaterial: builder.mutation({
      query: (id) => ({
        url: `material_management/material_management_update/${id}`,
        method: "DELETE",
      }),
    }),
    // Delete Material
  }),
});

export const {
  useCreateMaterialMutation,
  useGetMaterialsQuery,
  useUpdateMaterialMutation,
  useDeleteMaterialMutation
} = materialApi;
