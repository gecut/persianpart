import { api } from '#persianpart/client';

import { request, setProvider } from '@gecut/signal';
import localStorageJson from '@gecut/utilities/local-storage-json';

setProvider('data.user', async () => {
  if (localStorageJson.get('user.id', null) == null) {
    return {};
  }

  const _return = await api.user.info.query();

  return _return ?? {};
});

setProvider('data.settings', async () => {
  if ((await request('data.user', {}, 'cacheFirst'))._id != null) {
    return await api.setting.repository.query();
  }

  return {};
});

setProvider('data.user.orders', async () => {
  if ((await request('data.user', {}, 'cacheFirst'))._id != null) {
    return await api.order.list.query();
  }

  return [];
});

setProvider('data.users', async () => {
  if ((await request('data.user', {}, 'cacheFirst')).permission === 'root') {
    return await api.user.repository.query();
  }

  return [];
});

setProvider('data.products', async () => {
  if ((await request('data.user', {}, 'cacheFirst'))._id != null) {
    return await api.product.repository.query();
  }

  return [];
});

setProvider('data.orders', async () => {
  if ((await request('data.user', {}, 'cacheFirst')).permission === 'root') {
    return await api.order.repository.query();
  }

  return [];
});
