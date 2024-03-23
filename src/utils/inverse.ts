export type Inverse<T extends Invertible> = {
  [Key in keyof T as T[Key]]: Key
}

export type Invertible = {[key: PropertyKey]: PropertyKey}

export function Inverse<T extends Invertible>(obj: Readonly<T>): Inverse<T> {
  return Object.entries<T[keyof T]>(obj).reduce(
    (reversed, [key, val]) => ({...reversed, [val]: key}),
    <Inverse<T>>{}
  )
}
