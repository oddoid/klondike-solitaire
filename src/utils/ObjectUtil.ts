export namespace ObjectUtil {
  type ReversibleRecord<T> = Record<keyof T, keyof any & T[keyof T]>
  type ReverseRecord<T> = Record<keyof any & T[keyof T], keyof T>

  export function reverseRecord<T>(
    object: Readonly<ReversibleRecord<T>>
  ): ReverseRecord<T> {
    return entries(object).reduce(
      (reversed, [key, value]) => ({...reversed, [value]: key}),
      <ReverseRecord<T>>{}
    )
  }

  // https://github.com/Microsoft/TypeScript/pull/12253
  export function keys<T>(object: Readonly<T & object>): (keyof T)[] {
    const keys = []
    for (const key in object) if (object.hasOwnProperty(key)) keys.push(key)
    return keys
  }

  // https://github.com/Microsoft/TypeScript/pull/12253
  export function values<T>(object: Readonly<T & object>): T[keyof T][] {
    const values = []
    for (const key in object)
      if (object.hasOwnProperty(key)) values.push(object[key]!)
    return values
  }

  // https://github.com/Microsoft/TypeScript/pull/12253
  export function entries<T>(
    object: Readonly<T & object>
  ): [keyof T, T[keyof T]][] {
    return keys(object).map(key => [key, object[key]!])
  }
}
