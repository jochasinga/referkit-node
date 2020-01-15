import axios from 'axios';
import {Auth} from '../auth';
import {Product} from '../product';
import {User, Referral} from '../user';
import {userUrl} from '../endpoints';

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

  describe('Getting list of users', () => {
    it('should get a list of users', async () => {
      const users = [jane, john];
      const pagesize = users.length;
      const res = {
        data: {users},
      };
      const mockedAxios = axios as jest.Mocked<typeof axios>;
      mockedAxios.get.mockResolvedValue(res);
      const usersList = await User.getAll(pagesize);
      expect(usersList.length).toEqual(pagesize);
      expect(mockedAxios.get)
        .toHaveBeenCalledWith(userUrl + `?pagesize=${pagesize}`);

      await User.getAll();
      expect(mockedAxios.get).toHaveBeenCalledWith(userUrl);
    });
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

    it('should fail to create a user without auth', async () => {
      try {
        await auth.logout();
        await jane.create();
      } catch (err) {
        expect(err).not.toBeNull();
      }
    });
  });

  describe('Getting a user', () => {
    it('should create a user', async () => {
      for (let user of users) {
        const [u0, u1] = user;
        const res = {data: {user: u1}};
        const mockedAxios = axios as jest.Mocked<typeof axios>;
        mockedAxios.get.mockResolvedValue(res);
        let u = await u0.get();
        expect(u.uid).toEqual(u1.uid);
        expect(u.emailAddress).toEqual(u1.emailAddress);
        expect(u.firstName).toEqual(u1.firstName);
        expect(u.lastName).toEqual(u1.lastName);
        expect(u.phoneNumber).toEqual(u1.phoneNumber);
        expect(u.created).toEqual(u1.created);
        expect(u.referral).toEqual(u1.referral);
      }
    });

    it('should fail to get a user without auth', async () => {
      for (let user of users) {
        const [u0, _] = user;
        try {
          await auth.logout();
          await u0.update({emailAddress: 'foo@gmail.com'});
        } catch (err) {
          expect(err).not.toBeNull();
        }
      }
    });
  });

  describe('Updating a user', () => {
    it('should update a user', async () => {
      for (let user of users) {
        const [u0, u1] = user;
        u1.firstName += 'foo';
        u1.lastName += 'bar';

        let res = {data: {user: u1}};
        let mockedAxios = axios as jest.Mocked<typeof axios>;
        mockedAxios.post.mockResolvedValue(res);

        let u = await u0.update({
          firstName: u0.firstName + 'foo',
          lastName: u0.lastName + 'bar'
        });

        expect(u.uid).toEqual(u1.uid);
        expect(u.emailAddress).toEqual(u1.emailAddress);
        expect(u.firstName).toEqual(u1.firstName);
        expect(u.lastName).toEqual(u1.lastName);
        expect(u.phoneNumber).toEqual(u1.phoneNumber);
        expect(u.created).toEqual(u1.created);
        expect(u.referral).toEqual(u1.referral);

        u1.emailAddress = 'foo@mail.com'

        res = {data: {user: u1}};
        mockedAxios.post.mockResolvedValue(res);

        u = await u0.update({emailAddress: 'foo@mail.com'});
        expect(u.emailAddress).toEqual(u1.emailAddress);
      }
    });

    it('should fail to update a user without auth', async () => {
      for (let user of users) {
        const [u0, _] = user;
        try {
          await auth.logout();
          await u0.update({emailAddress: 'foo@gmail.com'});
        } catch (err) {
          expect(err).not.toBeNull();
        }
      }
    });
  });

  describe('Deleting a user', () => {
    it('should delete a user', async () => {
      for (let user of users) {
        const [u0, u1] = user;

        let res = {data: {user: u1}};
        let mockedAxios = axios as jest.Mocked<typeof axios>;
        mockedAxios.delete.mockResolvedValue(res);

        let u = await u0.delete();

        expect(u.uid).toEqual(u1.uid);
        expect(u.emailAddress).toEqual(u1.emailAddress);
        expect(u.firstName).toEqual(u1.firstName);
        expect(u.lastName).toEqual(u1.lastName);
        expect(u.phoneNumber).toEqual(u1.phoneNumber);
        expect(u.created).toEqual(u1.created);
        expect(u.referral).toEqual(u1.referral);
      }
    });

    it('should fail to delete a user without auth', async () => {
      for (let user of users) {
        const [u0, _] = user;
        try {
          await auth.logout();
          await u0.delete();
        } catch (err) {
          expect(err).not.toBeNull();
        }
      }
    });
  });

});
