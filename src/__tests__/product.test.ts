import axios from 'axios';
import {Auth} from '../auth';
import {Product} from '../product';

jest.mock('axios');

describe('Product class', () => {
  const domain = 'alphaseek.io';
  const alias = 'alphaseek-io-7321';
  const token = 'aeGe109Felxbg10Fzge1039';
  const uid = 'efl1230FB2ldedge0';
  const created = new Date('1995-12-17T03:24:00');
  const product = {uid, alias, created, domain};

  let prod: Product;
  let auth: Auth;

  beforeEach(async () => {
    const res = {data: {token}};
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.post.mockResolvedValue(res);
    auth = new Auth();
    await auth.login('fake@gmail.com', 'foobar');
    prod = Object.assign(
      new Product(domain, {auth}), product,
    );
  });

  describe('Creating a product', () => {
    beforeEach(() => {
      const res = {data: {product: prod}};
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      mockedAxios.post.mockResolvedValue(res);
    });

    it('should create a product', async () => {
      let p = await prod.create();
      expect(p).toEqual(prod);
    });

    it('should fail to create a product without auth', async () => {
      await auth.logout();
      try {
        await prod.create();
      } catch (err) {
        expect(err).not.toBeNull();
      }
    });
  });

  describe('Getting a product', () => {
    beforeEach(() => {
      const res = {data: {product: prod}};
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      mockedAxios.get.mockResolvedValue(res);
    });

    it('should get a product', async () => {
      let p = await prod.get(alias);
      expect(p).toEqual(prod);
    });

    it('should throw an error if auth is invalid', async () => {
      await auth.logout();
      try {
        await prod.get(alias);
      } catch (err) {
        expect(err).not.toBeNull();
      }
    });
  });

  describe('Updating a product', () => {
    beforeEach(() => {
      const res = {data: {product: prod}};
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      mockedAxios.post.mockResolvedValue(res);
    });

    it('should update a product', async () => {
      const res = {data: {product: prod}};
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      mockedAxios.post.mockResolvedValue(res);
      const newAlias = 'babadook-9999';
      let p = await prod.update({alias: newAlias});
      expect(p).toEqual(Object.assign(prod, {alias: newAlias}));
    });

    it('should throw an error if auth is invalid', async () => {
      const res = {data: {product: prod}};
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      mockedAxios.post.mockResolvedValue(res);
      const newAlias = 'babadook-9999';
      await auth.logout();
      try {
        await prod.update({alias: newAlias});
      } catch (err) {
        expect(err).not.toBeNull();
      }
    });
  });

  describe('Deleting a product', () => {
    beforeEach(() => {
      const res = {data: {success: true}};
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      mockedAxios.delete.mockResolvedValue(res);
    });

    it('should delete a product', async () => {
      const ok = await prod.delete();
      expect(ok).toBeTruthy();
    });

    it('should throw an error if auth is invalid', async () => {
      await auth.logout();
      try {
        await prod.delete();
      } catch (err) {
        expect(err).not.toBeNull();
      }
    });
  });
});
