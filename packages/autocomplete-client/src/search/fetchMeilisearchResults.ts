import {
  AlgoliaMultipleQueriesQuery,
  AlgoliaSearchResponse,
} from '@meilisearch/instant-meilisearch'
import { HIGHLIGHT_PRE_TAG, HIGHLIGHT_POST_TAG } from '../constants'
import { AutocompleteSearchClient } from '../types/AutocompleteSearchClient'

interface SearchParams {
  /**
   * The initialized Meilisearch search client.
   */
  searchClient: AutocompleteSearchClient
  /**
   * A list of queries to execute.
   */
  queries: AlgoliaMultipleQueriesQuery[]
}

export function fetchMeilisearchResults<TRecord = Record<string, any>>({
  searchClient,
  queries,
}: SearchParams): Promise<Array<AlgoliaSearchResponse<TRecord>>> {
  return searchClient
    .search<TRecord>(
      queries.map((searchParameters) => {
        const { params, ...headers } = searchParameters

        return {
          ...headers,
          params: {
            hitsPerPage: 5,
            highlightPreTag: HIGHLIGHT_PRE_TAG,
            highlightPostTag: HIGHLIGHT_POST_TAG,
            ...params,
          },
        }
      })
    )
    .then(
      (response: Awaited<ReturnType<typeof searchClient.search<TRecord>>>) => {
        return response.results
      }
    )
}
