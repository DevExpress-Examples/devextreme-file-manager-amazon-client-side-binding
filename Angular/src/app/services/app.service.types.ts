export type Nullable<T> = T | null | undefined;

export interface FileEntry {
  etag: Nullable<string>;
  name: Nullable<string>;
  lastModified: Nullable<Date>;
  length: number;
}
