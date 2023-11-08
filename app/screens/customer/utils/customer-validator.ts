import * as yup from "yup";
import {translate} from "../../../i18n";

export const CustomerValidationSchema = yup.object().shape({
    customerId: yup
        .string(),
    customerFirstName: yup
        .string()
        .required(translate('errors.required'))
        .label(translate('invoiceFormScreen.customerSelectionForm.customerCreationForm.firstName')),
    customerLastName: yup
        .string()
        .required(translate('errors.required'))
        .label(translate('invoiceFormScreen.customerSelectionForm.customerCreationForm.lastName')),
    customerAddress: yup
        .string()
        .required(translate('errors.required'))
        .label(translate('invoiceFormScreen.customerSelectionForm.customerCreationForm.address')),
    customerPhoneNumber: yup
        .string()
        .required(translate('errors.required'))
        .label(translate('invoiceFormScreen.customerSelectionForm.customerCreationForm.phoneNumber')),
    customerEmail: yup.string().email(translate('errors.invalidEmail')).label(translate('invoiceFormScreen.customerSelectionForm.customerCreationForm.email')),
});