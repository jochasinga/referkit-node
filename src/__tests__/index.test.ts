import axios from 'axios';
import {login, logout} from '../index';

jest.mock('axios');

describe('Top-level module functions', () => {
  const token = 'efl1230FB2ldedge0';
  it('should return an access token on login', async () => {
    const res = {data: {token}};
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.post.mockResolvedValue(res);
    const tok = await login('fake@gmail.com', 'foobar');
    expect(tok).toBe(token);
  });

  it('Should return true on logout', async () => {
    const res = {success: true};
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.post.mockResolvedValue(res);
    const ok = await logout();
    expect(ok).toBeTruthy();
  });
});
