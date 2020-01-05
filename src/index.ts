import axios from 'axios';
import {loginUrl, logoutUrl} from './endpoints';
import {Auth} from './Auth';

async function login(emailAddress: string, password: string): Promise<string> {
  try {
    const res = await axios.post(loginUrl, {emailAddress, password})
    const {token} = res.data;
    return token;
  } catch (err) {
    return err;
  }
}

async function logout(token: string): Promise<boolean> {
  if (token.length < 7) {
    return new Promise((_, reject) => {
      reject('Token is empty or too short');
    });
  }

  try {
    const res = await axios.post(logoutUrl, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const {success} = res.data;
    return success;
  } catch (err) {
    return err;
  }
}

export {Auth, login, logout};

