import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const lotoRegisterApi = createApi({
  reducerPath: "lotoRegisterApi",
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
    // Endpoint for creating a LOTO registration (applied form)
    createLotoRegister: builder.mutation({
      query: (formData) => ({
        url: "annexures_module/create_loto_register",
        method: "POST",
        body: formData,
        formData: true, // Important for file uploads
      }),
    }),
    
    // Endpoint for updating LOTO registration with removal information
    updateLotoRegister: builder.mutation({
      query: ({ id, formData }) => {
        // Validate the id parameter
        if (!id || isNaN(id)) {
          throw new Error('Valid LOTO register ID is required');
        }
        
        return {
          url: `annexures_module/update_loto_register/${id}`,
          method: "PUT",
          body: formData,
          formData: true, // Important for file uploads
        };
      },
    }),
    
    // Endpoint for getting LOTO registrations by location
    getLotoRegisters: builder.query({
      query: (locationId) => {
        // Validate the locationId parameter
        if (!locationId || isNaN(locationId)) {
          throw new Error('Valid location ID is required');
        }
        
        return {
          url: `annexures_module/get_loto_register/${locationId}`,
          method: "GET",
        };
      },
      // Add proper error handling
      transformErrorResponse: (response, meta, arg) => {
        console.error('Error in LOTO registers query:', response);
        return response;
      },
    }),
  }),
});

export const {
  useCreateLotoRegisterMutation,
  useUpdateLotoRegisterMutation,
  useGetLotoRegistersQuery,
} = lotoRegisterApi;