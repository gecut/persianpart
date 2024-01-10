import { getValue, setProvider } from '@gecut/signal';

setProvider('fullscreenLoader', (type) => {
  let oldValue = getValue('fullscreenLoader') ?? 0;

  if (type === 'start') {
    oldValue++;
  } else if (type === 'end') {
    oldValue--;
  }

  return Math.max(oldValue, 0);
});
