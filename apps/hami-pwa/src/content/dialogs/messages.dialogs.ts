import icons from '#persianpart/ui/icons';

import i18n from '@gecut/i18n';
import { request } from '@gecut/signal';
import { M3 } from '@gecut/ui-kit';

const submitOrderConfirmation = (
  onConfirm: (event: Event) => void,
  onClose: (event: Event) => void,
) =>
  M3.Content.confirmationDialog(
    i18n.msg('are-you-sure-you-want-to-place-your-order'),
    i18n.msg('are-you-sure'),
    icons.filledRounded.doneAll,
    {
      close: {
        title: i18n.msg('cancel'),
      },
      confirmation: {
        title: i18n.msg('confirm'),
      },
      onConfirm,
      onClose,
    },
    'var(--md-sys-color-primary)',
  );

const signOutConfirmation = (
  onConfirm: (event: Event) => void,
  onClose: (event: Event) => void,
) =>
  M3.Content.confirmationDialog(
    i18n.msg('are-you-sure-you-want-to-sign-out'),
    i18n.msg('are-you-sure'),
    icons.filledRounded.doneAll,
    {
      close: {
        title: i18n.msg('close'),
      },
      confirmation: {
        title: i18n.msg('sign-out'),
      },
      onConfirm,
      onClose,
    },
    'var(--md-sys-color-primary)',
  );

const untilSubmitOrderConfirmation = async (): Promise<void> => {
  return await new Promise<void>((resolve, reject) => {
    request(
      'dialog',
      submitOrderConfirmation(
        () => resolve(),
        () => reject(),
      ),
    );
  });
};

const untilSignOutConfirmation = async (): Promise<void> => {
  return await new Promise<void>((resolve, reject) => {
    request(
      'dialog',
      signOutConfirmation(
        () => resolve(),
        () => reject(),
      ),
    );
  });
};

export default { untilSubmitOrderConfirmation, untilSignOutConfirmation };
