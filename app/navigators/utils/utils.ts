import { Invoice, InvoiceStatus } from '../../models/entities/invoice/invoice';

export type NavigatorParamList = {
  welcome: undefined;
  forgotPassword: undefined;
  registration: undefined;
  resetPassword: { email: string };
  home: undefined;
  transactionList: undefined;
  customer: undefined;
  product: undefined;
  oauth: { code: string; state: string };
  profile: undefined;
  legalFile: undefined;
  invoices: undefined;
  invoiceForm: {
    invoiceID?: string;
    status?: InvoiceStatus;
  };
  invoicePreview: {
    fileId: string;
    invoiceTitle: string;
    invoice: Invoice;
  };
  bank: undefined;
  partners: undefined;
  changePassword: {
    userName: string;
    password: string;
  };
  profileEdition: undefined;
};

export type TabNavigatorParamList = {
  prospect: undefined;
  forgotPassword: undefined;
  bp_home: undefined;
  marketplace: undefined;
  paymentInitiation: undefined;
  paymentList: {
    initialRoute?: string;
  };
  supportContact: undefined;
  invoices: undefined;
  invoiceForm: {
    invoiceID?: string;
    initialStatus?: InvoiceStatus;
  };
  invoicePreview: {
    fileId: string;
    invoiceTitle: string;
    invoice: Invoice;
  };
};
