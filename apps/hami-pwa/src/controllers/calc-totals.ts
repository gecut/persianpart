import type { Projects } from '@gecut/types';

const orderProductListTotalPurchase = (
  productList: Projects.Hami.OrderProductModel[],
) =>
  productList
    .map((product) => (product.purchasePrice ?? 0) * (product.quantity ?? 1))
    .reduce((p, c) => p + c, 0);

const orderListTotalPurchase = (
  orderList: Projects.Hami.OrderModel[],
): number =>
  orderList
    .map((order) => orderProductListTotalPurchase(order.productList))
    .reduce((p, c) => p + c, 0);

const orderProductListTotalSales = (
  productList: Projects.Hami.OrderProductModel[],
) =>
  productList
    .map((product) => (product.salesPrice ?? 0) * (product.quantity ?? 1))
    .reduce((p, c) => p + c, 0);

const orderListTotalSales = (orderList: Projects.Hami.OrderModel[]): number =>
  orderList
    .map((order) => orderProductListTotalSales(order.productList))
    .reduce((p, c) => p + c, 0);

const orderListTotalProfit = (orderList: Projects.Hami.OrderModel[]): number =>
  orderListTotalSales(orderList) - orderListTotalPurchase(orderList);

export default {
  orderListTotalProfit,
  orderListTotalPurchase,
  orderProductListTotalPurchase,
  orderListTotalSales,
  orderProductListTotalSales,
};
