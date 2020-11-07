export namespace ObjectUtil {
  type ReversibleRecord<T> = Record<keyof T, keyof any & T[keyof T]>
  type ReverseRecord<T> = Record<keyof any & T[keyof T], keyof T>

  export function reverseRecord<T>(
    object: Readonly<ReversibleRecord<T>>
  ): ReverseRecord<T> {
    return Object.entries(object).reduce(
      (reversed, [key, value]) => ({
        ...reversed,
        [<keyof ReverseRecord<T>>value]: key
      }),
      <ReverseRecord<T>>{}
    )
  }
}
