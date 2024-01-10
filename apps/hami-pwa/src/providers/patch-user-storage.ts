import { setProvider } from '@gecut/signal';

import { fetchJSON } from '../controllers/request-base';

setProvider('patch-user-storage', async (jsonBody) => {
  return await fetchJSON<Record<string, never>>('user-storage/', {
    method: 'patch',
    json: jsonBody,
  });
});
