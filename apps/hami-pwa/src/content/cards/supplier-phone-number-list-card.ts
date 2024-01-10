import icons from '#hami/ui/icons';

import i18n from '@gecut/i18n';
import { sanitizer } from '@gecut/utilities/sanitizer';

import type { Projects } from '@gecut/types';
import type { M3 } from '@gecut/ui-kit';

export function supplierPhoneNumberItem(
  supplierPhoneNumber: Projects.Hami.SupplierPhoneNumber,
): M3.Types.ListItemContent {
  return {
    component: 'list-item',
    type: 'list-item-link',
    attributes: {
      headline: supplierPhoneNumber.name,
      supportingText: i18n.phone(supplierPhoneNumber.phoneNumber),
      href: `tel:${supplierPhoneNumber.phoneNumber}`,
      classes: ['supplier-phone-number-item'],
      styles: {
        '--_list-item-trailing-supporting-text-color':
          'var(--md-sys-color-primary)',
        'width': '100%',
      },
    },
    children: [
      {
        component: 'icon',
        type: 'svg',
        attributes: { slot: 'start' },
        SVG: icons.outlineRounded.call,
      },
    ],
  };
}

export function supplierPhoneNumberListCard(
  supplier: Projects.Hami.SupplierModel,
): M3.Types.SurfaceCardContent {
  const items = [
    {
      name: i18n.msg('main'),
      phoneNumber: sanitizer.str(supplier.phoneNumber),
    },
    ...supplier.phoneNumberList,
  ];

  return {
    component: 'surface-card',
    type: 'filled',
    attributes: {
      styles: { 'margin-bottom': 'calc(2*var(--sys-spacing-track,8px))' },
    },
    children: items.map((item) => supplierPhoneNumberItem(item)),
  };
}
