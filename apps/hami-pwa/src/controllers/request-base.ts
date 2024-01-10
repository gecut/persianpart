import config from '#hami/config';
import { getByErrorCode } from '#hami/controllers/api-server-error-message';

import { request } from '@gecut/signal';
import { cancelNextAnimationFrame, nextAnimationFrame } from '@gecut/utilities/polyfill';
import ky from 'ky';

import type { AlwatrServiceResponseFailed } from '@alwatr/type';
import type { StringifyableRecord } from '@gecut/types';
import type { Options, ResponsePromise } from 'ky';

const requestDebounceObject: Record<string, number> = {};

const convertUrlToKey = (url: string): string => {
  const _url = new URL(url);

  return _url.href.replace(config.apiUrl, '').replace(_url.search, '');
};

const promisesListSignalToggle = (
  _request: Request,
  type: 'add' | 'remove',
) => {
  const key = convertUrlToKey(_request.url);

  if (requestDebounceObject[`${type}-${key}`] != null) {
    cancelNextAnimationFrame(requestDebounceObject[`${type}-${key}`]);
  }

  requestDebounceObject[`${type}-${key}`] = nextAnimationFrame(() => {
    request('promises-list', {
      key,
      type,
    });
  });
};

export const requestBase = ky.create({
  prefixUrl: config.apiUrl,
  cache: 'reload',
  hooks: {
    beforeRequest: [
      (request) => {
        promisesListSignalToggle(request, 'add');
      },
    ],
    afterResponse: [
      (request) => {
        promisesListSignalToggle(request, 'remove');
      },
    ],
    beforeError: [
      (error) => {
        promisesListSignalToggle(error.request, 'remove');

        return error;
      },
    ],
  },
  retry: {
    limit: 5,
  },
});

export async function fetchJSON<TJson extends StringifyableRecord>(
  url: string,
  options?: Options | undefined,
): Promise<TJson> {
  options = {
    method: 'get',
    searchParams: {
      uid: localStorage.getItem('USER_ID') ?? '',
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('USER_TOKEN')}`,
    },

    ...options,
  };

  if (options.searchParams != null) {
    const searchParams = new URLSearchParams(
      options.searchParams as Record<string, string>,
    );

    if (searchParams.get('uid') === '') {
      throw new Error('uid_empty');
    }
  }

  const response: ResponsePromise = await requestBase(url, options).catch(
    async (error) => {
      let message = '';

      if (error != null && error.response != null) {
        const response =
          (await error.response.json()) as AlwatrServiceResponseFailed;

        message = getByErrorCode(response.errorCode);
      } else {
        message = getByErrorCode();
      }

      request('messenger', {
        component: 'snack-bar',
        type: 'ellipsis-message',
        attributes: { message: message, closeButton: true },
      });

      return error;
    },
  );

  return await response.json<TJson>();
}
