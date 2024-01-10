import { translate } from '../../../i18n';
import { palette } from '../../../theme/palette';
import emptyToNull from '../../../utils/empty-to-null';
import { showMessage } from '../../../utils/snackbar';

export const intiaValueRenderer = customer => {
  if (customer) {
    const { id, name, firstName, lastName, address, email, phone, comment } = customer;
    return {
      customerId: id,
      customerCompanyName: name,
      customerFirstName: firstName,
      customerLastName: lastName,
      customerAddress: address,
      customerEmail: email,
      customerPhoneNumber: phone,
      customerComment: comment,
    };
  } else {
    return {
      customerCompanyName: '',
      customerFirstName: '',
      customerLastName: '',
      customerAddress: '',
      customerEmail: '',
      customerPhoneNumber: '',
      customerComment: '',
    };
  }
};

export const saveOrUpdate = async (visibleModal, setVisibleModal, customerStore, values) => {
  try {
    visibleModal.type === 'CREATION'
      ? await customerStore.saveCustomer({
          ...emptyToNull({
            name: values.customerCompanyName,
            firstName: values.customerFirstName,
            lastName: values.customerLastName,
            email: values.customerEmail,
            phone: values.customerPhoneNumber,
            address: values.customerAddress,
            comment: values.customerComment,
            customerType: values.customerType,
            website: null,
            city: null,
            country: null,
          }),
          zipCode: 0,
        })
      : await customerStore.updateCustomer({
          ...emptyToNull({
            id: values.customerId,
            name: values.customerCompanyName,
            firstName: values.customerFirstName,
            lastName: values.customerLastName,
            email: values.customerEmail,
            phone: values.customerPhoneNumber,
            address: values.customerAddress,
            comment: values.customerComment,
            customerType: values.customerType,
            website: null,
            city: null,
            country: null,
          }),
          zipCode: 0,
        });
    setTimeout(() => {
      showMessage(translate('invoiceFormScreen.customerSelectionForm.customerCreationForm.addOrUpdate'), { backgroundColor: palette.green });
    }, 1500);
  } catch (e) {
    __DEV__ && console.tron.log(e);
  } finally {
    setVisibleModal({
      type: 'CREATION',
      state: false,
      customer: null,
    });
  }
};
