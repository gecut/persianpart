# Gecut Data Manager

<!-- TODO: Write a Description -->

## Receiver Concept

receiver of data and cache on memory ram and update

## Sender Concept

sender of data and update dependencies data, for example when create new todo, should update todo list data

# How can i use ?

step by step to use `@gecut/data-manager`

## First Step

define type of receivers and senders

```ts
declare global {
  interface GecutReceiverServices {
    readonly 'todo-storage': TodoInterface[];
  }
  interface GecutSenderServices {
    readonly 'new-todo': TodoInterface;
  }
}
```

## Second Step

define dataManager from a new instance of `DataManager` class

```ts
const dataManager = new DataManager(
  {
    'todo-storage': {
      receiverFunction() {
        // receive todo-storage data and return
        return api.storage.query();
      },
    },
  },
  {
    'new-todo': {
      // when send data update todo-storage
      dependencies: ['todo-storage'],
      async senderFunction(newTodo) {
        // send new todo data to back-end
        await api.new.mutate(newTodo);
      },
    },
  },
);
```

## Third Step

```ts
// define this in Component Class and use
// receiver controller has autoUpdate (automatic requestUpdate)
todoStorage = new ReceiverController(
  this,
  'todoStorage',
  'todo-storage',
  dataManager,
  {
    success: this.renderTodoListTemplate.bind(this),
    'first-pending': () => html`Loading...`,
    error: () => html`Error`,
  },
);

// outUpdate is Boolean, mean update states out of controller (update data)
todoStorage.render(outUpdate);
```

## Fourth Step

```ts
// use this for send data
dataManager.senders['new-todo']?.send({
  status: true,
  message: textInputValue,
});
```
