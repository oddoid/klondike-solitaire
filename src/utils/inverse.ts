import { mapEntries } from 'std/collections/map_entries.ts'

export type Inverse<T extends Invertible> = {
  [Key in keyof T as T[Key]]: Key
}

export type Invertible = Record<PropertyKey, PropertyKey>

export function Inverse<T extends Invertible>(obj: Readonly<T>): Inverse<T> {
  return mapEntries(
    obj as Record<string, string>,
    ([key, val]) => [val, key],
  ) as Inverse<T>
}
