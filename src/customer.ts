interface ICustomer {
  uid: string;
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  products: string[];
  created: Date;
}

export default ICustomer;
