import axios from 'axios';
import { Product } from './product';
import { userUrl } from './endpoints';

interface IUpdateProps {
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
  phoneNumber?: string;
  referral?: IReferral;
}

interface IUserConfig {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  from?: string;
  product?: Product;
}

interface IUser {
  uid: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  created: Date;
  referral: IReferral;
}

interface IReferral {
  uid: string;
  score: number;
  moniker: string;
  url: string;
  urlDest: string;
  referrer: User;
  referrees: User[];
}

export class User implements IUser {
  public static async getAll(pagesize: number = 20): Promise<User[]> {
    const url = userUrl + (pagesize === 20 ? '' : `?pagesize=${pagesize}`);
    const res = await axios.get(url);
    const { users } = res.data;
    return users;
  }

  public uid: string = '';
  public firstName: string;
  public lastName: string;
  public emailAddress: string;
  public phoneNumber: string;
  public created: Date = new Date();
  public referral: IReferral = {} as IReferral;
  private product: Product;

  constructor(emailAddress: string, config: IUserConfig) {
    const { product } = config;
    if (product === undefined) {
      throw Error('Product cannot be empty');
    }

    this.product = product;

    const { firstName, lastName, phoneNumber, from } = config;
    this.emailAddress = emailAddress;
    this.firstName = firstName || '';
    this.lastName = lastName || '';
    this.phoneNumber = phoneNumber || '';
    this.referral = { moniker: from } as IReferral;
  }

  public async create(): Promise<User> {
    const { auth } = this.product;
    if (!auth?.isLoggedIn) {
      const err = new Error('Auth is invalid');
      return new Promise((_, reject) => reject(err));
    }

    try {
      const res = await axios.post(userUrl, {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      });
      const { user } = res.data;
      return user;
    } catch (err) {
      return err;
    }
  }

  public async get(email: string = ''): Promise<User> {
    const { auth } = this.product;
    if (!auth?.isLoggedIn) {
      const err = new Error('Auth is invalid');
      return new Promise((_, reject) => reject(err));
    }

    email = email === '' ? this.emailAddress : email;

    try {
      const url: string = userUrl + '/' + email;
      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      });
      const { user } = res.data;
      return user;
    } catch (err) {
      return err;
    }
  }

  public async update(props: IUpdateProps): Promise<User> {
    const { auth } = this.product;
    if (!auth?.isLoggedIn) {
      const err = new Error('Auth is invalid');
      return new Promise((_, reject) => reject(err));
    }

    try {
      const url: string = userUrl + '/' + this.emailAddress;
      const res = await axios.post(
        url,
        Object.assign(props, {
          headers: {
            Authorization: `Bearer ${auth?.token}`,
          },
        }),
      );
      const { user } = res.data;
      return user;
    } catch (err) {
      return err;
    }
  }

  public async delete(email: string = ''): Promise<User> {
    const { auth } = this.product;
    if (!auth?.isLoggedIn) {
      const err = new Error('Auth is invalid');
      return new Promise((_, reject) => reject(err));
    }

    email = email === '' ? this.emailAddress : email;

    try {
      const url: string = userUrl + '/' + email;
      const res = await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
      });
      const { user } = res.data;
      return user;
    } catch (err) {
      return err;
    }
  }
}

export { IReferral as Referral };
