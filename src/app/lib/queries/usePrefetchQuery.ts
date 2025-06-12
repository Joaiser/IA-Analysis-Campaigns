'use client'

import { useEffect } from "react"
import { useQueryClient, QueryKey, QueryFunction } from "@tanstack/react-query"

export function usePrefetchQuery<T>(
    key: QueryKey,
    fn: QueryFunction<T>,
    staleTime: number = 1000 * 60 * 60
) {
    const queryClient = useQueryClient()

    useEffect(() => {
        queryClient.prefetchQuery({
            queryKey: key,
            queryFn: fn,
            staleTime
        })
    }, [key, fn, staleTime, queryClient])
}