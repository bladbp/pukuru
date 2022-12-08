export function* mergeSort<T>(
  arr: T[],
  size = 1,
  leftStart = 0,
  buffer = new Array<T>()
): Generator<
  [T, T, { sorted: T[]; size: number; leftStart: number; buffer: T[] }],
  T[],
  boolean
> {
  let sorted = arr.slice();
  const n = sorted.length;

  for (; size < n; size *= 2) {
    for (; leftStart < n; leftStart += 2 * size) {
      let left = leftStart;
      let right = Math.min(left + size, n);
      const leftLimit = right;
      const rightLimit = Math.min(right + size, n);
      let i = left;
      while (left < leftLimit && right < rightLimit) {
        const choice = yield [
          sorted[left],
          sorted[right],
          { sorted, size, leftStart, buffer },
        ];
        if (choice) {
          buffer[i++] = sorted[left++];
        } else {
          buffer[i++] = sorted[right++];
        }
      }
      while (left < leftLimit) {
        buffer[i++] = sorted[left++];
      }
      while (right < rightLimit) {
        buffer[i++] = sorted[right++];
      }
    }
    let temp = sorted;
    sorted = buffer;
    buffer = temp;
  }

  return sorted;
}
