import axios from 'axios';
import {Product} from '../product';

jest.mock('axios');

describe('Product class', () => {
  const domain = 'alphaseek.io';
  const alias = 'alphaseek-io-7321';
  const token = 'aeGe109Felxbg10Fzge1039';
  const uid = 'efl1230FB2ldedge0';
  const created = new Date('1995-12-17T03:24:00');
  const product = <Product>{uid, alias, created, domain};

  let prod: Product;

  beforeEach(() => {
    prod = new Product(domain, {token});
  });

  it('should create a product', async () => {
    const res = {data: {product}};
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.post.mockResolvedValue(res);
    let p = await prod.create();
    expect(p).toEqual(product);
  });

  it('should get a product', async () => {
    const res = {data: {product}};
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.get.mockResolvedValue(res);
    let p = await prod.get(alias);
    expect(p).toEqual(product);
  });

  it('should update a product', async () => {
    const res = {data: {product}};
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.post.mockResolvedValue(res);
    const newAlias = 'babadook-9999';
    let p = await prod.update({alias: newAlias});
    expect(p).toEqual(Object.assign(product, {alias: newAlias}));
  });

  it('should delete a product', async () => {
    const res = {data: {success: true}};
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.delete.mockResolvedValue(res);
    const ok = await prod.delete();
    expect(ok).toBeTruthy();
  });
});
