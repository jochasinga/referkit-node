import axios from 'axios';
import {Auth} from '../auth';

jest.mock('axios');

describe('Auth static class', () => {
  const token = 'efl1230FB2ldedge0';
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

  it('Should return true', async () => {
    const res = {success: true};
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.post.mockResolvedValue(res);
    const ok = await Auth.logout();
    expect(ok).toBeTruthy();
  });
});
