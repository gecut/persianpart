function number(max: number, min = 0): number {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min) + min);
}

function array<T>(arr: Array<T>): T {
  return arr[number(arr.length)];
}

function phoneNumber(country: 'IR'): string {
  if (country === 'IR') {
    return '091' + number(10000000, 99999999);
  }

  return '-----------';
}

export default {
  number,
  array,
  phoneNumber,
};
