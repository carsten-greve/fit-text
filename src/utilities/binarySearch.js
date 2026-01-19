// https://github.com/darkskyapp/binary-search
//
// You pass the function a sorted array, a value, and the sort comparator function. If the value is found in the array,
// it returns a nonnegative integer representing the index of the value in the array. (Note that if your array contains
// duplicates, the index within the run of duplicates is arbitrary.) If the value is not in the array, then -(index + 1)
// is returned, where index is where the value should be inserted into the array to maintain sorted order.
//
// You may also pass the search function optional fourth and fifth arguments, representing the minimum and maximum indices
// of the array to search, in case you wish to limit the section of the array searched. (These default, of course, to 0 and
// length-1, respectively.)
//
// The sort comparator function should be the same one you use to sort your array. It accepts optional third and fourth
// arguments, the current index and the overall array: these should not be necessary except in highly unusual circumstances.

export const binarySearch = (haystack, needle, comparator, low, high) => {
  var mid, cmp;

  if(low === undefined)
    low = 0;

  else {
    low = low|0;
    if(low < 0 || low >= haystack.length)
      throw new RangeError("invalid lower bound");
  }

  if(high === undefined)
    high = haystack.length - 1;

  else {
    high = high|0;
    if(high < low || high >= haystack.length)
      throw new RangeError("invalid upper bound");
  }

  while(low <= high) {
    // The naive `low + high >>> 1` could fail for array lengths > 2**31
    // because `>>>` converts its operands to int32. `low + (high - low >>> 1)`
    // works for array lengths <= 2**32-1 which is also Javascript's max array
    // length.
    mid = low + ((high - low) >>> 1);
    cmp = +comparator(haystack[mid], needle, mid, haystack);

    // Too low.
    if(cmp < 0.0)
      low  = mid + 1;

    // Too high.
    else if(cmp > 0.0)
      high = mid - 1;

    // Key found.
    else
      return mid;
  }

  // Key not found.
  return ~low;
}
