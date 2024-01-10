import { api } from '#gtodo/client';
import type { TodoInterface } from '#gtodo/libs/db';
import type {
  NewTodoType,
  EditTodoType,
  RemoveTodoType,
} from '#gtodo/libs/validator';

import { DataManager } from '@gecut/data-manager/index';

declare global {
  interface GecutReceiverServices {
    readonly 'todo-storage': TodoInterface[];
  }
  interface GecutSenderServices {
    readonly 'new-todo': NewTodoType[number];
    readonly 'edit-todo': EditTodoType;
    readonly 'delete-todo': RemoveTodoType;
  }
}

const dataManager = new DataManager(
  {
    'todo-storage': {
      async receiverFunction() {
        return await api.storage.query();
      },
    },
  },
  {
    'new-todo': {
      dependencies: ['todo-storage'],
      async senderFunction(data) {
        await api.new.mutate([data]);
      },
    },
    'edit-todo': {
      dependencies: ['todo-storage'],
      async senderFunction(data) {
        await api.edit.mutate(data);
      },
    },
    'delete-todo': {
      dependencies: ['todo-storage'],
      async senderFunction(data) {
        await api.remove.mutate(data);
      },
    },
  },
);

dataManager.on('pending', (pending) => {
  console.log('pending', pending);
});

export default dataManager;
