import { randomUUID } from 'node:crypto';

import { db, debouncedWrite } from './db';
import { publicProcedure, router } from './trpc';
import { newTodo, removeTodo, editTodo } from './validator';

import type { TodoInterface } from './db';

export const appRouter = router({
  // Get Data Routes
  storage: publicProcedure.query(async () => db.data),

  // Change Data Routes
  new: publicProcedure.input(newTodo).mutation(async (options) => {
    options.input = options.input.map((todo) => {
      todo.id = randomUUID();
      todo.createdAt = Date.now();
      todo.updatedAt = Date.now();

      return todo;
    });

    db.data.push(...((options.input ?? []) as TodoInterface[]));

    debouncedWrite();

    return [];
  }),
  remove: publicProcedure.input(removeTodo).mutation(async (option) => {
    db.data = db.data.filter((todo) => todo.id !== option.input);

    debouncedWrite();

    return [];
  }),
  edit: publicProcedure.input(editTodo).mutation(async (option) => {
    db.data = db.data.map((todo): TodoInterface => {
      if (todo.id == option.input.id) {
        return {
          ...todo,

          ...option.input,

          id: todo.id,
        };
      }

      return todo;
    });

    return [];
  }),
});

export type AppRouter = typeof appRouter;

// setTimeout(() => {
//   const caller = appRouter.createCaller({});

//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   for (const _i of range(10)) {
//     caller.new([
//       {
//         status: false,
//         message: lorem({
//           lang: 'en',
//           sizeType: 'sentence',
//           size: 2,
//         }),
//       },
//     ]);
//   }
// }, 1000);
