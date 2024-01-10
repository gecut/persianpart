import { getValue, setProvider } from '@gecut/signal';

setProvider('loading', (type) => {
  let oldValue = getValue('loading') ?? 0;

  if (type === 'start') {
    oldValue++;
  } else if (type === 'end') {
    oldValue--;
  }

  return Math.max(oldValue, 0);
});
