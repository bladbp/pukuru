export function* mergeSort<T>(arr: T[]): Generator<[T, T], T[], boolean> {
  var sorted = arr.slice(),
    n = sorted.length,
    buffer = new Array<T>(n);

  for (var size = 1; size < n; size *= 2) {
    for (var leftStart = 0; leftStart < n; leftStart += 2 * size) {
      var left = leftStart,
        right = Math.min(left + size, n),
        leftLimit = right,
        rightLimit = Math.min(right + size, n),
        i = left;
      while (left < leftLimit && right < rightLimit) {
        const choice = yield [sorted[left], sorted[right]];
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
    var temp = sorted,
      sorted = buffer,
      buffer = temp;
  }

  return sorted;
}

// const m = mergeSort(arr);
// let choice = m.next();
// let result = [];
// for (; ;) {
//   const [a, b] = choice.value;
//   if (choice.done) {
//     result = choice.value;
//     break;
//   }
//   choice = m.next(a < b);
// }
// console.log(result);
