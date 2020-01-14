import axios from 'axios';
import {Auth} from '../auth';
import {Product} from '../product';
import {User, Referral} from '../user';

jest.mock('axios');

describe('User class', () => {
  const domain = 'alphaseek.io';
  const alias = 'alphaseek-io-7321';
  const token = 'aeGe109Felxbg10Fzge1039';
  const uid = 'efl1230FB2ldedge0';
  const created = new Date('1995-12-17T03:24:00');
  const product = {uid, alias, created, domain};

  let prod: Product;
  let auth: Auth;
  let jane: User;
  let john: User;
  let joe: User;

  const janeEmail = 'jane.doe@gmail.com';
  const johnEmail = 'john.doe@gmail.com';
  const joeEmail = 'joe.chas@gmail.com';

  const janeX = <User>{
    uid: '234Edbgeadg013432rafewgFE',
    emailAddress: janeEmail,
    firstName: '',
    lastName: '',
    phoneNumber: '',
    created: new Date(),
  };

  const johnX = <User>{
    uid: '234Edbgeadg013432rafewgFE',
    emailAddress: johnEmail,
    firstName: 'John',
    lastName: 'Doe',
    phoneNumber: '',
    created: new Date(),
  };

  const joeX:User = <User>{
    uid: '234Edbgeadg013432rafewgFE',
    emailAddress: joeEmail,
    firstName: 'Joe',
    lastName: 'Chasinga',
    phoneNumber: '3476092075',
    created: new Date(),
    referral: <Referral>{
      moniker: '8Ae30Fg',
    }
  };

  let users: Array<[User, User]>;

  beforeEach(async () => {
    const res = {data: {token}};
    const mockedAxios = axios as jest.Mocked<typeof axios>;
    mockedAxios.post.mockResolvedValue(res);
    auth = new Auth();
    await auth.login('fake@gmail.com', 'foobar');
    prod = Object.assign(new Product(domain, {auth}), product);
    jane = new User(janeEmail, {product: prod});
    john = new User(johnEmail, {
      product: prod,
      firstName: 'John',
      lastName: 'Doe',
    });
    joe = new User(joeEmail, {
      product: prod,
      firstName: 'Joe',
      lastName: 'Chasinga',
      phoneNumber: '3476092075',
      from: '8Ae30Fg',
    });
    users = [
      [jane, janeX],
      [john, johnX],
      [joe, joeX],
    ];
  });

  describe('Creating a user', () => {
    it('should create a user', async () => {
      for (let user of users) {
        const [u0, u1] = user;
        const res = {data: {user: u1}};
        const mockedAxios = axios as jest.Mocked<typeof axios>;
        mockedAxios.post.mockResolvedValue(res);
        let u = await u0.create();
        expect(u.uid).toEqual(u1.uid);
        expect(u.emailAddress).toEqual(u1.emailAddress);
        expect(u.firstName).toEqual(u1.firstName);
        expect(u.lastName).toEqual(u1.lastName);
        expect(u.phoneNumber).toEqual(u1.phoneNumber);
        expect(u.created).toEqual(u1.created);
        expect(u.referral).toEqual(u1.referral);
      }
    });

    // it('should fail to create a user without auth', async () => {
    //   await auth.logout();
    //   try {
    //     await jane.create();
    //   } catch (err) {
    //     expect(err).not.toBeNull();
    //   }
    // });
  });

  // describe('Getting a product', () => {
  //   beforeEach(() => {
  //     const res = {data: {product: prod}};
  //     const mockedAxios = axios as jest.Mocked<typeof axios>;
  //     mockedAxios.get.mockResolvedValue(res);
  //   });

  //   it('should get a product', async () => {
  //     let p = await prod.get(alias);
  //     expect(p).toEqual(prod);
  //   });

  //   it('should throw an error if auth is invalid', async () => {
  //     await auth.logout();
  //     try {
  //       await prod.get(alias);
  //     } catch (err) {
  //       expect(err).not.toBeNull();
  //     }
  //   });
  // });

  // describe('Updating a product', () => {
  //   beforeEach(() => {
  //     const res = {data: {product: prod}};
  //     const mockedAxios = axios as jest.Mocked<typeof axios>;
  //     mockedAxios.post.mockResolvedValue(res);
  //   });

  //   it('should update a product', async () => {
  //     const res = {data: {product: prod}};
  //     const mockedAxios = axios as jest.Mocked<typeof axios>;
  //     mockedAxios.post.mockResolvedValue(res);
  //     const newAlias = 'babadook-9999';
  //     let p = await prod.update({alias: newAlias});
  //     expect(p).toEqual(Object.assign(prod, {alias: newAlias}));
  //   });

  //   it('should throw an error if auth is invalid', async () => {
  //     const res = {data: {product: prod}};
  //     const mockedAxios = axios as jest.Mocked<typeof axios>;
  //     mockedAxios.post.mockResolvedValue(res);
  //     const newAlias = 'babadook-9999';
  //     await auth.logout();
  //     try {
  //       await prod.update({alias: newAlias});
  //     } catch (err) {
  //       expect(err).not.toBeNull();
  //     }
  //   });
  // });

  // describe('Deleting a product', () => {
  //   beforeEach(() => {
  //     const res = {data: {success: true}};
  //     const mockedAxios = axios as jest.Mocked<typeof axios>;
  //     mockedAxios.delete.mockResolvedValue(res);
  //   });

  //   it('should delete a product', async () => {
  //     const ok = await prod.delete();
  //     expect(ok).toBeTruthy();
  //   });

  //   it('should throw an error if auth is invalid', async () => {
  //     await auth.logout();
  //     try {
  //       await prod.delete();
  //     } catch (err) {
  //       expect(err).not.toBeNull();
  //     }
  //   });
  // });
});
