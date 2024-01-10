import { z } from 'zod';

export const todoValidation = z
  .object({
    status: z.boolean(),
    message: z.string(),
    id: z.string(),
    createdAt: z.number(),
    updatedAt: z.number(),
  })
  .partial({
    createdAt: true,
    updatedAt: true,
    id: true,
  });

export const newTodo = z.array(todoValidation);

export const removeTodo = z.string();

export const editTodo = todoValidation.required({ id: true }).partial({
  message: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

export type TodoValidationType = z.TypeOf<typeof todoValidation>;

export type NewTodoType = z.TypeOf<typeof newTodo>;

export type RemoveTodoType = z.TypeOf<typeof removeTodo>;

export type EditTodoType = z.TypeOf<typeof editTodo>;
