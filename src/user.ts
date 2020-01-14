import axios from 'axios';
import {Product} from './product';
import {userUrl} from './endpoints';

interface UserConfig {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  from?: string;
  product?: Product;
}

interface UserInterface {
  uid: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  created: Date;
  referral: Referral;
}

export interface Referral {
  uid: string;
  score: Number;
  moniker: string;
  url: string;
  urlDest: string;
  referrer: User;
  referrees: Array<User>;
}

export class User implements UserInterface {
  uid: string = '';
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  created: Date = new Date();
  referral: Referral = <Referral>{};

  private product: Product;

  constructor(emailAddress: string, config: UserConfig) {
    const {product} = config;
    if (product === undefined) {
      throw Error('Product cannot be empty');
    }

    this.product = product;

    const {firstName, lastName, phoneNumber, from} = config;
    this.emailAddress = emailAddress;
    this.firstName = firstName || '';
    this.lastName = lastName || '';
    this.phoneNumber = phoneNumber || '';
    this.referral = <Referral>{moniker: from};
  }

  async create(): Promise<User> {
    const {auth} = this.product;
    if (!(auth?.isLoggedIn)) {
      const err = new Error('Auth is invalid');
      return new Promise((_, reject) => reject(err));
    }

    try {
      const res = await axios.post(userUrl, {
        headers: {
          'Authorization': `Bearer ${auth?.token}`,
        }
      });
      const {user} = res.data;
      const {
        uid, firstName, lastName,
        emailAddress, phoneNumber,
        created, referral,
      } = user;

      this.uid = uid;
      this.emailAddress = emailAddress;
      this.firstName = firstName;
      this.lastName = lastName;
      this.phoneNumber = phoneNumber;
      this.referral = referral;
      this.created = new Date(created);

      return this;
    } catch (err) {
      return err;
    }
  }

  async get(email: string = ''): Promise<User> {
    const {auth} = this.product;
    if (!(auth?.isLoggedIn)) {
      const err = new Error('Auth is invalid');
      return new Promise((_, reject) => reject(err));
    }

    email = email === '' ? this.emailAddress : email;

    try {
      const url: string = userUrl + '/' + email;
      const res = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${auth?.token}`,
        }
      });
      const {user} = res.data;
      const {
        uid, firstName, lastName,
        emailAddress, phoneNumber,
        created, referral,
      } = user;

      this.uid = uid;
      this.emailAddress = emailAddress;
      this.firstName = firstName;
      this.lastName = lastName;
      this.phoneNumber = phoneNumber;
      this.referral = referral;
      this.created = new Date(created);

      return this;
    } catch (err) {
      return err;
    }
  }
}