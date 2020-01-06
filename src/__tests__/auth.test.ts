import axios from 'axios';
import {Auth} from '../auth';

jest.mock('axios');

describe('Auth class', () => {
  const key = 'alphaseekToken';
  const token = 'efl1230FB2ldedge0';

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

    // it('should not have set useLocalStorage to true', () => {
    //   expect(Auth.useLocalStorage).toBeFalsy();
    // });

    // it('should set useLocalStorage to true', () => {
    //   Auth.useLocalStorage = true;
    //   expect(Auth.useLocalStorage).toBeTruthy();
    // });

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
  });
});

