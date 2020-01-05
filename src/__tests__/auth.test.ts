import axios from 'axios';
import {Auth} from '../auth';

jest.mock('axios');

describe('Auth static class', () => {
  const key = 'alphaseekToken';
  const token = 'efl1230FB2ldedge0';

  beforeEach(() => {
    Storage.prototype.setItem = jest.fn();
    Storage.prototype.removeItem = jest.fn();
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

  it('should not have set useLocalStorage to true', () => {
    expect(Auth.useLocalStorage).toBeFalsy();
  });

  it('should set useLocalStorage to true', () => {
    Auth.useLocalStorage = true;
    expect(Auth.useLocalStorage).toBeTruthy();
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
});
