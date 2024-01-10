import type { TodoInterface } from '#gtodo/libs/db';
import dataManager from '#gtodo/manager/data';

import { ReceiverController } from '@gecut/data-manager/controllers';
import { loggerElement } from '@gecut/mixins';
import { request } from '@gecut/signal';
import { M3 } from '@gecut/ui-kit';
import { animate } from '@lit-labs/motion';
import { html, unsafeCSS } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import styles from './app.element.css?inline';

import type { RenderResult } from '@gecut/types';
import type { MdFilledTextField } from '@material/web/textfield/filled-text-field';

declare global {
  interface HTMLElementTagNameMap {
    'app-root': AppRoot;
  }
}

let textInputValue = '';

@customElement('app-root')
export class AppRoot extends loggerElement {
  static override styles = unsafeCSS(styles);

  static headlineTemplate = M3.Renderers.renderTypoGraphy({
    component: 'typography',
    type: 'h1',
    children: ['Gtodo List'],
  });

  static fabExtendedTemplate = M3.Renderers.renderFAB({
    component: 'fab',
    type: 'fab',
    events: {
      click: () => {
        request(
          'dialog',
          M3.Content.dialog(
            ['New Item'],
            [
              {
                component: 'text-field',
                type: 'outlined',
                attributes: {
                  inputType: 'text',
                  name: 'text-filed',
                  value: textInputValue,
                  styles: {
                    width: '100%',
                  },
                },
                events: {
                  input: (event) => {
                    const target = event.target as MdFilledTextField;

                    textInputValue = target.value;
                  },
                },
              },
            ],
            [
              {
                component: 'button',
                type: 'text',
                children: ['Add'],
                events: {
                  click: () => {
                    dataManager.senders['new-todo']?.send({
                      status: false,
                      message: textInputValue,
                    });

                    textInputValue = '';
                  },
                },
              },
            ],
          ),
        );
      },
    },
    attributes: {
      label: 'New item',
      size: 'medium',
      variant: 'primary',
      classes: ['fab'],
    },
  });

  todoStorage = new ReceiverController(
    this,
    'todoStorage',
    'todo-storage',
    dataManager,
    {
      'success': this.renderTodoListTemplate.bind(this),
      'first-pending': () => html`Loading...`,
      'error': () => html`Error`,
    },
  );

  @state()
  private loadingTasks: string[] = [];

  override render(): RenderResult {
    super.render();

    return html`
      ${AppRoot.headlineTemplate} ${this.todoStorage.render()}
      ${AppRoot.fabExtendedTemplate}

      <dialog-outlet></dialog-outlet>
    `;
  }

  static renderDetailTodo(todo: TodoInterface): void {
    request(
      'dialog',
      M3.Content.dialog(
        [
          'Edit Todo',
          {
            component: 'icon-button',
            type: 'icon-button',
            iconSVG:
              '<svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 -960 960 960" width="48"><path d="M261-120q-24.75 0-42.375-17.625T201-180v-570h-11q-12.75 0-21.375-8.675-8.625-8.676-8.625-21.5 0-12.825 8.625-21.325T190-810h158q0-13 8.625-21.5T378-840h204q12.75 0 21.375 8.625T612-810h158q12.75 0 21.375 8.675 8.625 8.676 8.625 21.5 0 12.825-8.625 21.325T770-750h-11v570q0 24.75-17.625 42.375T699-120H261Zm438-630H261v570h438v-570ZM367-266h60v-399h-60v399Zm166 0h60v-399h-60v399ZM261-750v570-570Z"/></svg>',
            attributes: {
              styles: {
                'fill': 'currentcolor',
                'margin-inline-start': 'auto',
              },
            },
            events: {
              click: () => {
                dataManager.senders['delete-todo'].send(todo.id);
              },
            },
          },
        ],
        [
          {
            component: 'text-field',
            type: 'outlined',
            attributes: {
              name: 'text-field',
              value: todo.message,
              inputType: 'text',
              styles: {
                width: '100%',
              },
            },
            events: {
              input: (event) => {
                const target = event.target as MdFilledTextField;

                todo.message = target.value;
              },
            },
          },
        ],
        [
          {
            component: 'button',
            type: 'text',
            children: ['Edit'],
            events: {
              click: () => {
                dataManager.senders['edit-todo'].send({
                  ...todo,
                  message: todo.message,
                });
              },
            },
          },
        ],
      ),
    );
  }

  private renderTodoListTemplate(todoList?: TodoInterface[]): RenderResult {
    this.log.methodArgs?.('renderTodoListTemplate', { todoList });

    return html`${repeat(
      todoList
        ?.sort((a, b) => {
          if (a.createdAt == null || b.createdAt == null) return 0;

          return b.createdAt - a.createdAt;
        })
        .sort((a, b) => {
          const aNumber = a.status ? 1 : -1;
          const bNumber = b.status ? 1 : -1;

          return aNumber - bNumber;
        }) ?? [],
      (todo) => todo.id,
      (todo: TodoInterface) => html`
        <surface-card
          class="task-card ${todo.status ? 'task-complete' : ''}"
          @click=${() => AppRoot.renderDetailTodo(todo)}
          ${animate()}
        >
          <div>
            <p>${todo.message}</p>

            <md-checkbox
              @click=${(event: Event) => event.stopPropagation()}
              ?checked=${todo.status}
              ?hidden=${this.loadingTasks.includes(todo.id)}
              ?disabled=${this.loadingTasks.includes(todo.id)}
              @change=${async () => {
                this.loadingTasks = [...this.loadingTasks, todo.id];

                await dataManager.senders['edit-todo']?.send({
                  ...todo,

                  status: !todo.status,
                });

                this.loadingTasks = this.loadingTasks.filter(
                  (id) => id !== todo.id,
                );
              }}
            ></md-checkbox>
            <md-circular-progress
              indeterminate
              ?hidden=${!this.loadingTasks.includes(todo.id)}
            ></md-circular-progress>
          </div>
        </surface-card>
      `,
    )}`;
  }
}
