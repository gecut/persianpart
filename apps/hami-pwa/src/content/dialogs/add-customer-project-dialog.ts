import { validators } from '#hami/controllers/default-validators';
import icons from '#hami/ui/icons';

import i18n from '@gecut/i18n';
import { request } from '@gecut/signal';
import { M3 } from '@gecut/ui-kit';

import type { Projects } from '@gecut/types';

export function addCustomerProjectDialog(
  customerId: string,
  project?: Projects.Hami.CustomerProjectModel,
): M3.Types.DialogContent {
  const isEdit = project != null;
  const title = isEdit ? i18n.msg('edit-project') : i18n.msg('add-project');

  return M3.Content.dialog(
    [
      title,
      {
        component: 'icon-button',
        type: 'icon-button',
        iconSVG: icons.outlineRounded.delete,
        attributes: {
          disabled: !(isEdit === true),
          styles: {
            'margin-inline-start': 'auto',
          },
        },
        transformers: (target) => {
          target.addEventListener('click', async () => {
            if (project == null) return;

            project.active = false;

            target.disabled = true;
            await request('patch-customer-project-storage', {
              customerId,
              data: [project],
            });
            target.disabled = false;

            request('customer-storage', {});
            (await request('dialog', {}, 'cacheFirst')).close();
            request('messenger', {
              component: 'snack-bar',
              type: 'ellipsis-message',
              attributes: {
                message: i18n.msg('project-successfully-deleted'),
                align: 'bottom',
                duration: 2_000,
                closeButton: true,
              },
            });
          });

          return target;
        },
      },
    ],
    [
      {
        component: 'form-builder',
        type: 'form-builder',
        attributes: {
          styles: {
            'margin-top': '8px',
            '--padding-horizontal': '0',
          },
          data: {
            slides: {
              project: [
                {
                  component: 'text-field',
                  type: 'filled',
                  attributes: {
                    inputType: 'text',
                    value: project?.projectName,
                    name: 'projectName',
                    label: i18n.msg('project-name'),
                  },
                  validator: validators('required'),
                },
                {
                  component: 'text-field',
                  type: 'filled',
                  attributes: {
                    inputType: 'text',
                    value: project?.projectAddress,
                    name: 'projectAddress',
                    label: i18n.msg('project-address'),
                  },
                  validator: validators('required'),
                },
                {
                  component: 'text-field',
                  type: 'filled',
                  attributes: {
                    inputType: 'text',
                    value: project?.supervisorName,
                    name: 'supervisorName',
                    label: i18n.msg('supervisor-name'),
                  },
                  validator: validators('required'),
                },
                {
                  component: 'text-field',
                  type: 'filled',
                  attributes: {
                    inputType: 'tel',
                    value: project?.supervisorPhone,
                    name: 'supervisorPhone',
                    label: i18n.msg('supervisor-phone'),
                    textDirection: 'ltr',
                  },
                  validator: validators('required', 'phone'),
                },
                {
                  component: 'button',
                  type: 'filled',
                  disabled: 'auto',
                  action: 'form_submit',
                  children: [title],
                },
              ],
            },
            onSubmit: async (event) => {
              if (event.validate === true && event.values != null) {
                let newProject = event.values[
                  'project'
                ] as unknown as Projects.Hami.CustomerProject;

                if (newProject != null) {
                  if (project != null) {
                    newProject = {
                      ...project,

                      ...newProject,
                    };
                  }

                  await request('patch-customer-project-storage', {
                    data: [newProject],
                    customerId,
                  });
                  request('customer-storage', {});
                  (await request('dialog', {}, 'cacheFirst')).close();
                  request('messenger', {
                    component: 'snack-bar',
                    type: 'ellipsis-message',
                    attributes: {
                      message: i18n.msg('project-was-successfully-registered'),
                      align: 'bottom',
                      duration: 2_000,
                      closeButton: true,
                    },
                  });
                }
              }
            },
          },
          activeSlide: 'project',
        },
      },
    ],
  );
}
