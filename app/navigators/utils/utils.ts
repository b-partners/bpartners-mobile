import { AreaPictureDetails, UpdateProspect } from '@bpartners/typescript-client';

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
  oauth: {
    code: string;
    state: string;
  };
  profile: undefined;
  legalFile: undefined;
  invoices: undefined;
  invoiceForm: {
    invoiceID?: string;
    status?: InvoiceStatus;
    areaPictureId?: string;
  };
  invoicePreview: {
    fileId: string;
    invoiceTitle: string;
    invoice: Invoice;
  };
  bank: undefined;
  configuration: undefined;
  partners: undefined;
  prospectForm: undefined;
  changePassword: {
    userName: string;
    password: string;
  };
  profileEdition: undefined;
  calendar: undefined;
  annotatorEdition: {
    areaPictureDetails: AreaPictureDetails | undefined;
    pictureUrl: string | undefined;
    draftAnnotationId: string | undefined;
  };
  annotator: {};
};

export type TabNavigatorParamList = {
  home: {
    screen:
      | 'bp_home'
      | 'marketplace'
      | 'paymentInitiation'
      | 'prospect'
      | 'prospectConfiguration'
      | 'paymentList'
      | 'supportContact'
      | 'invoices'
      | 'invoiceForm'
      | 'annotator';
  };
  annotator: {
    invoiceID?: string;
    initialStatus?: InvoiceStatus;
    areaPictureId: string | undefined;
  };
  annotatorEdition: {
    pictureUrl: string | undefined;
    areaPictureDetails: AreaPictureDetails | undefined;
  };
  prospect: undefined;
  prospectForm: {
    prospect: UpdateProspect | undefined;
  };
  prospectConfiguration: undefined;
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
    areaPictureId: string | undefined;
  };
  invoicePreview: {
    fileId: string;
    invoiceTitle: string;
    invoice: Invoice;
  };
};
