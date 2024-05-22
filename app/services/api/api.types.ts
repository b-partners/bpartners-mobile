import { AccountHolder } from '../../models/entities/account-holder/account-holder';
import { Account } from '../../models/entities/account/account';
import { Annotation } from '../../models/entities/annotation/annotation';
import { AreaPicture } from '../../models/entities/area-picture/area-picture';
import { BusinessActivityItem } from '../../models/entities/business-activity/business-activity';
import { Calendar } from '../../models/entities/calendar/calendar';
import { Customer } from '../../models/entities/customer/customer';
import { File } from '../../models/entities/file/file';
import { Geojson } from '../../models/entities/geojson/geojson';
import { Invoice, InvoiceRelaunch, InvoiceSummary } from '../../models/entities/invoice/invoice';
import { LegalFile } from '../../models/entities/legal-file/legal-file';
import { Marketplace } from '../../models/entities/marketplace/marketplace';
import { Product } from '../../models/entities/product/product';
import { Prospect } from '../../models/entities/prospect/prospect';
import { RelaunchConfiguration } from '../../models/entities/relaunch-configuration/relaunch-configuration';
import { TransactionCategory } from '../../models/entities/transaction-category/transaction-category';
import { TransactionSummary } from '../../models/entities/transaction-summary/transaction-summary';
import { Transaction } from '../../models/entities/transaction/transaction';
import { User } from '../../models/entities/user/user';
import { GeneralApiProblem } from './api-problem';

export interface Whoami {
  user: any;
}

export type RedirectionUrlsStatus = {
  redirectionUrl: string;
  redirectionStatusUrls: {
    successUrl: string;
    failureUrl: string;
  };
};

export type GetAreaPictureAnnotationsResult = {
  id: string;
  idAreaPicture: string;
  creationDatetime: string;
  annotations: Annotation[];
};

export type RedirectionStatusUrls = { redirectionStatusUrls: { successUrl: string; failureUrl: string } };

export type RedirectUrls = { successUrl: string; failureUrl: string };

export type GetUsersResult = { kind: 'ok'; users: User[] } | GeneralApiProblem;
export type GetUserResult = { kind: 'ok'; user: User } | GeneralApiProblem;

export type GetTransactionsResult = { kind: 'ok'; transactions: Transaction[] } | GeneralApiProblem;

export type GetTransactionCategoriesResult = { kind: 'ok'; transactionCategories: TransactionCategory[] } | GeneralApiProblem;

export type GetTransactionsSummaryResult = { kind: 'ok'; transactionSummary: TransactionSummary } | GeneralApiProblem;

export type UpdateTransactionCategoriesResult = { kind: 'ok'; transactionCategories: TransactionCategory[] } | GeneralApiProblem;
export type AssociateTransactionResult = { kind: 'ok'; transaction: Transaction } | GeneralApiProblem;

export type GetOnboardingURL = { kind: 'ok'; redirectionUrl: string; successUrl: string; failureUrl: string } | GeneralApiProblem;
export type GetBusinessActivitiesResult = { kind: 'ok'; businessActivities: BusinessActivityItem[] } | GeneralApiProblem;

export type SignInResult = { kind: 'ok'; redirectionUrl: string; successUrl: string; failureUrl: string } | GeneralApiProblem;

export type InitiateConsentResult = { kind: 'ok'; redirectionStatusUrls: RedirectionUrlsStatus } | GeneralApiProblem;

export type InitiateTokenResult = { kind: 'ok' } | GeneralApiProblem;

export type GetCalendarResult = { kind: 'ok'; calendar: Calendar[] } | GeneralApiProblem;

export type GetEventResult = { kind: 'ok'; events: Event[] } | GeneralApiProblem;

export type BankConnection =
  | {
      kind: 'ok';
      redirectionUrl: string;
      redirectionStatusUrls: {
        successUrl: string;
        failureUrl: string;
      };
    }
  | GeneralApiProblem;

export type GetTokenResult = { kind: 'ok'; accessToken: string; refreshToken: string; whoami: Whoami } | GeneralApiProblem;

export type GetTokenRegistrationResult = { kind: 'ok'; user: User } | GeneralApiProblem;

export type GetWhoAmIResult = { kind: 'ok'; user: User } | GeneralApiProblem;

export type CreateUserResult = { kind: 'ok'; newUser: User } | GeneralApiProblem;

export type GetUserAccount = { kind: 'ok'; account: Account } | GeneralApiProblem;

export type GetCustomersResult = { kind: 'ok'; customers: Customer[] } | GeneralApiProblem;

export type GetProductsResult = { kind: 'ok'; products: Product[] } | GeneralApiProblem;

export type GetInvoicesResult = { kind: 'ok'; invoices: Invoice[] } | GeneralApiProblem;

export type GetInvoiceResult = { kind: 'ok'; invoice: Invoice } | GeneralApiProblem;

export type InvoiceRelaunchResult = { kind: 'ok'; invoiceRelaunch: InvoiceRelaunch } | GeneralApiProblem;

export type GetInvoiceRelaunchResult = { kind: 'ok'; invoiceRelaunch: InvoiceRelaunch[] } | GeneralApiProblem;

export type GetInvoiceRelaunchConfResult = { kind: 'ok'; RelaunchConf: RelaunchConfiguration } | GeneralApiProblem;

export type GetInvoiceSummaryResult = { kind: 'ok'; invoiceSummary: InvoiceSummary } | GeneralApiProblem;

export type UpdateInvoiceRelaunchConfResult = { kind: 'ok'; updatedRelaunchConf: RelaunchConfiguration } | GeneralApiProblem;

export type CrupdateInvoiceResult = { kind: 'ok'; invoice: Invoice } | GeneralApiProblem;

export type GetAccountHolderResult = { kind: 'ok'; accountHolder: AccountHolder } | GeneralApiProblem;

export type InitPaymentResult = { kind: 'ok'; paymentInitiation: { id: string } & RedirectionUrlsStatus } | GeneralApiProblem;

export type GetFileInformation = { kind: 'ok'; fileInfos: File } | GeneralApiProblem;

export type GetFileURLResult = { kind: 'ok'; fileURL: string } | GeneralApiProblem;

export type UploadFileResult = { kind: 'ok'; message: string } | GeneralApiProblem;

export type GetMarketplaceResult = { kind: 'ok'; marketplaces: Marketplace[] } | GeneralApiProblem;

export type GetProspectResult = { kind: 'ok'; prospects: Prospect[] } | GeneralApiProblem;

export type GetAreaPictureResult = { kind: 'ok'; areaPicture: AreaPicture } | GeneralApiProblem;

export type GetAreaPicturesResult = { kind: 'ok'; areaPictures: AreaPicture[] } | GeneralApiProblem;

export type UpdateProspectResult = { kind: 'ok'; prospect: Prospect } | GeneralApiProblem;

export type GetLegalFilesResult = { kind: 'ok'; legalFiles: LegalFile[] } | GeneralApiProblem;

export type ApproveLegalFileResult = { kind: 'ok'; legalFile: LegalFile } | GeneralApiProblem;

export type UpdateAccountHodlerInfo = { kind: 'ok'; accountHolder: AccountHolder } | GeneralApiProblem;

export type GeojsonResult = { kind: 'ok'; geojson: Geojson[] } | GeneralApiProblem;
