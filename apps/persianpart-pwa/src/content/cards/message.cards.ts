import i18n from '@gecut/i18n';
import { MaterialSymbols } from '@gecut/icons/material-symbols';
import { M3 } from '@gecut/ui-kit';

const orderNotFound = M3.Content.iconMessageCard(
  i18n.msg('order-not-found'),
  MaterialSymbols.OutlineRounded.EventBusy,
);
const productNotFound = M3.Content.iconMessageCard(
  i18n.msg('product-not-found'),
  MaterialSymbols.OutlineRounded.EventBusy,
);
const fetching = M3.Content.iconMessageCard(
  i18n.msg('receiving-information-from-the-server'),
  MaterialSymbols.Outline.Pending,
  'var(--md-sys-color-gold)',
);
const fetchErrored = M3.Content.iconMessageCard(
  i18n.msg('there-was-an-error-receiving-information-from-the-server'),
  MaterialSymbols.OutlineRounded.Error,
  'var(--md-sys-color-danger)',
);

export default {
  orderNotFound,
  productNotFound,
  fetching,
  fetchErrored,
};
