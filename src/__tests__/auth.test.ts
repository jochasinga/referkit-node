import axios from 'axios';
import {Auth} from '../auth';
import {Customer} from '../customer';

jest.mock('axios');

describe('Auth class', () => {
  const key = 'alphaseekToken';
  const token = 'efl1230FB2ldedge0';
  const customer = <Customer>{
    uid: '123456789',
    firstName: 'Joe',
    lastName: 'Chasinga',
    emailAddress: 'joe@alphaseek.io',
    phoneNumber: '+19892010421',
    products: [
      'alphaseek-io-7321',
      'referkit-io-9999',
    ],
    created: new Date(),
  };

  describe('Auth static class', () => {
    beforeAll(() => {
      Storage.prototype.setItem = jest.fn();
      Storage.prototype.removeItem = jest.fn();
      Storage.prototype.getItem = jest.fn((key: string) => token);
    });

    it('should return an access token on login', async () => {
      const res = {data: {token}};
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      mockedAxios.post.mockResolvedValue(res);
      const tok = await Auth.login('fake@gmail.com', 'foobar');
      expect(tok).toBe(token);
    });

    it('shoulda set the token property', () => {
      expect(Auth.token).toBe(token);
    });

    it('mocks and calls window.localStorage.setItem', async () => {
      const res = {data: {token}};
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      mockedAxios.post.mockResolvedValue(res);
      await Auth.login('fake@gmail.com', 'foobar');
      expect(window.localStorage.setItem).toHaveBeenCalledWith(key, token);
    });

    it('Should return true', async () => {
      const res = {data: {success: true}};
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      mockedAxios.post.mockResolvedValue(res);
      const ok = await Auth.logout();
      expect(ok).toBeTruthy();
      expect(window.localStorage.removeItem).toHaveBeenCalledWith(key);
    });

    it('should return customer\'s info', async () => {
      const res = {data: {me: customer}};
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      mockedAxios.get.mockResolvedValue(res);
      const cust = await Auth.me();
      expect(cust).toEqual(customer);
    });
  });

  describe('Auth instance', () => {
    let auth: Auth;
    beforeEach(() => {
      auth = new Auth();
    });

    it('should has a loggedout singleton', () => {
      expect(Auth.hasCurrent()).toBeTruthy();
      expect(Auth.current.isLoggedIn).toBeFalsy();
    });

    it('should log in correctly', async () => {
      const res = {data: {token}};
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      mockedAxios.post.mockResolvedValue(res);
      const tok = await auth.login('fake@gmail.com', 'password');
      expect(tok).toBe(token);
      expect(auth.token).toBe(token);
      expect(auth.isLoggedIn).toBeTruthy();
      expect(Auth.current.isLoggedIn).toBeTruthy();
      expect(Auth.current).toBe(auth);
    });

    it('should replace old singletons with new ones', () => {
      expect(Auth.current).toBe(auth);

      const auth1 = new Auth();
      expect(Auth.current).not.toBe(auth);
      expect(Auth.current).toBe(auth1);

      const auth2 = new Auth();
      expect(Auth.current).not.toBe(auth1);
      expect(Auth.current).toBe(auth2);
    });

    it('should return customer\'s info', async () => {
      const res = {data: {me: customer}};
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      mockedAxios.get.mockResolvedValue(res);
      const cust = await auth.me();
      expect(cust).toEqual(customer);
    });
  });
});

