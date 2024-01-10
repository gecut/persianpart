import content from '../../content';

import { data, bulkData } from './dummy-data';

test('Check English Product Title', () => {
  const title = data('products', 'en')?.title;
  const titleList = content.products.en.map((product) => product.title);

  expect(title).not.toBeNull();
  expect(titleList).toContain(title);
});

test('Check English Product Brand', () => {
  const brand = data('products', 'en')?.brand;
  const brandList = content.products.en.map((product) => product.brand);

  expect(brand).not.toBeNull();
  expect(brandList).toContain(brand);
});

test('Check English Product Category', () => {
  const category = data('products', 'en')?.category;
  const categoryList = content.products.en.map((product) => product.category);

  expect(category).not.toBeNull();
  expect(categoryList).toContain(category);
});

test('Check English Product Description', () => {
  const description = data('products', 'en')?.description;
  const descriptionList = content.products.en.map(
    (product) => product.description,
  );

  expect(description).not.toBeNull();
  expect(descriptionList).toContain(description);
});

test('', () => {
  const bulk = bulkData('products', 'en');

  expect(bulk.length).toEqual(content.products.en.length);
});
