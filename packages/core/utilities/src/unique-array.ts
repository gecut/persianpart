export default function uniqueArray<T extends Array<unknown>>(array: T): T {
  return array.filter((item, index) => array.indexOf(item) === index) as T;
}
