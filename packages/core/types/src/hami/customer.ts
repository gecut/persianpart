import type { CustomerProjectModel } from './customer-project.js';
import type { AlwatrDocumentObjectActive } from './document-object-active.js';
import type { OrderModel } from './order.js';
import type { RequireFunc } from './require-functions.js';
import type { UserResponse } from './user.js';

export interface CustomerModel extends Customer {
  projectList: CustomerProjectModel[];
  orderList: OrderModel[];
  creator?: UserResponse;
}

export interface Customer extends AlwatrDocumentObjectActive {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;

  description?: string;

  creatorId?: string;
}

export const customerRequire: RequireFunc<Customer> = (
  customer: Partial<Customer>,
): Customer => ({
  id: 'auto_increment',
  creatorId: undefined,
  description: undefined,
  firstName: undefined,
  lastName: undefined,
  phoneNumber: undefined,
  active: true,

  ...customer,
});
