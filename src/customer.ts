export interface Customer {
  uid: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  products: Array<string>;
  created: Date;
}
