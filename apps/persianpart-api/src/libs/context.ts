import { UserModel } from '#persianpart/entities/user';

import type { StringifyableRecord } from '@gecut/types';
import type { inferAsyncReturnType } from '@trpc/server';
import type * as trpcNext from '@trpc/server/adapters/next';

async function getUserFromHeader(request: StringifyableRecord) {
  const authorization = request.headers['authorization'];

  if (authorization != null) {
    const id = String(authorization).replace('Bearer ', '');

    try {
      const user = await UserModel.findById(id);

      if (user.active === true) return user;
    } catch (error) {
      return null;
    }
  }

  return null;
}

export async function createContext({
  req,
}: trpcNext.CreateNextContextOptions) {
  const user = await getUserFromHeader(req);

  return {
    user,
  };
}
export type Context = inferAsyncReturnType<typeof createContext>;
