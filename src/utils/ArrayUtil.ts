export namespace ArrayUtil {
  /**
   * Shuffle items in place.
   * https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
   * https://blog.codinghorror.com/the-danger-of-naivete/
   */
  export function shuffle(array: unknown[], random: () => number): void {
    for (let i = array.length - 1; i; i--)
      swap(array, i, ~~(random() * (i + 1)))
  }

  /** Swap left and right values in place. */
  export function swap(array: unknown[], left: number, right: number): void {
    ;[array[left], array[right]] = [array[right], array[left]]
  }
}
