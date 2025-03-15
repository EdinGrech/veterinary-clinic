export enum ContentState {
  LOADING = 'LOADING',
  LOADED = 'LOADED',
  ERROR = 'ERROR',
  NOT_INITIALIZED = 'NOT_INITIALIZED',
}

export interface ContentCache<T> {
  state: ContentState;
  data?: T;
  error?: string;
}
