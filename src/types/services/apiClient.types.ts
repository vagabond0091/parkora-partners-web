export interface RequestOptions {
  headers?: Record<string, string>;
  auth?: boolean;
  params?: Record<string, string>;
}

export interface RequestOptionsWithBody extends RequestOptions {
  body?: unknown;
}
