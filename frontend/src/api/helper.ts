import { apiClient } from '@/api/client.ts'

export async function getPaged<T, U> (
  url: string,
  params: Record<string, any>,
  processPage: (store: U, page: number, data: T) => U,
  initialStore: U,
  pageSize = 30,
): Promise<U | undefined> {
  let pageCount = 0

  while (true) {
    const response = await apiClient.get(url, {
      params: {
        page: pageCount,
        pageSize,
        ...params,
      },
    })

    if (response.status >= 200 && response.status < 300) {
      // when data is an array, we can stop
      if (Array.isArray(response.data) && response.data.length === 0) {
        return initialStore
      }
      // check if the response data is an object with pagination
      if (!response.data || !response.data.pagination) {
        throw new Error('Invalid response format: Missing pagination data')
      }

      const store = processPage(initialStore, pageCount, response.data as T)
      if (store) {
        initialStore = store
      }

      // Check if we reached the end of the data
      if (response.data.pagination.isEnd) {
        return initialStore
      }

      // Increment page count for the next iteration
      pageCount++
    }
  }
}
