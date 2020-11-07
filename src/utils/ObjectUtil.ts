export namespace ObjectUtil {
  type ReversibleRecord<T> = Record<keyof T, keyof any & T[keyof T]>
  type ReverseRecord<T> = Record<keyof any & T[keyof T], keyof T>

  export function reverseRecord<T>(
    object: Readonly<ReversibleRecord<T>>
  ): ReverseRecord<T> {
    return Object.entries<keyof any & T[keyof T]>(object).reduce(
      (reversed, [key, value]) => ({
        ...reversed,
        [value]: key
      }),
      <ReverseRecord<T>>{}
    )
  }
}
