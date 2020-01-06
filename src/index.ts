import {Auth} from './auth';

async function login(emailAddress: string, password: string): Promise<string> {
  return await Auth.login(emailAddress, password);
}

async function logout(): Promise<boolean> {
  return await Auth.logout();
}

export {Auth, login, logout};

