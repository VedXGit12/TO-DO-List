import { create } from 'zustand'
import type { Todo, Project } from '../types/todo'

interface SearchState {
  query: string
  results: Array<Todo | Project>
  isSearching: boolean

  setQuery: (query: string) => void
  setResults: (results: Array<Todo | Project>) => void
  setIsSearching: (value: boolean) => void
  clearSearch: () => void
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  results: [],
  isSearching: false,

  setQuery: (query) => set({ query }),
  setResults: (results) => set({ results }),
  setIsSearching: (value) => set({ isSearching: value }),
  clearSearch: () => set({ query: '', results: [], isSearching: false }),
}))
