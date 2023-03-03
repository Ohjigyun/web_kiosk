import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ 
    baseUrl: `${process.env.NEXT_PUBLIC_BASE_URL}`
  }),
  tagTypes: ['User'],
  // The "endpoints" represent operations and requests for this server
  endpoints: builder => ({
    // The `getPosts` endpoint is a "query" operation that returns data
    signupUser: builder.mutation({
      query: (body) => ({
        url: `/user/signup-user`,
        method: 'POST',
        body
      }),
    }),
  })
})
  export const { useSignupUserMutation } = apiSlice
