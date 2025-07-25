import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

export const postApi = createApi({
    reducerPath: 'postApi',
    baseQuery : fetchBaseQuery({baseUrl: 'https://dummyjson.com/'}),
    endpoints: (builder) => ({
        getPosts: builder.query({
            query: ({limit = 10, skip = 0}) => `posts?limit=${limit}&skip=${skip}`,
        }),
    }),
});

export const {useGetPostsQuery} = postApi;