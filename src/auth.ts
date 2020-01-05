import axios from 'axios';
import {loginUrl, logoutUrl} from './endpoints';

export class Auth {

  static get token() {
    return Auth._token;
  }

  public static async login(emailAddress: string, password: string): Promise<string> {
    try {
      const res = await axios.post(loginUrl, {emailAddress, password})
      const {token} = res.data;
      Auth.setToken(token);
      return token;
    } catch (err) {
      return err;
    }
  }

  public static async logout(): Promise<boolean> {
    try {
      const res = await axios.post(logoutUrl, {
        headers: {
          'Authorization': `Bearer ${Auth.token}`,
        }
      });
      const {success} = res.data;
      return success;
    } catch (err) {
      return err;
    }
  }

  private static _token: string;
  private static setToken(tok: string) {
    Auth._token = tok.trim();
  }
}
