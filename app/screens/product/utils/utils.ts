import { translate } from '../../../i18n';
import { palette } from '../../../theme/palette';
import { commaToDot } from '../../../utils/comma-to-dot';
import emptyToNull from '../../../utils/empty-to-null';
import { amountToMajors, vatToMinors } from '../../../utils/money';
import { showMessage } from '../../../utils/snackbar';

export const intiaValueRenderer = product => {
  if (product) {
    const { id, unitPrice, description } = product;

    return {
      id: id,
      unitPrice: amountToMajors(unitPrice).toString(),
      description: description,
    };
  } else {
    return {
      unitPrice: '',
      description: '',
    };
  }
};

export const saveOrUpdate = async (visibleModal, setVisibleModal, productStore, values) => {
  try {
    visibleModal.type === 'CREATION'
      ? await productStore.saveProduct({
          ...emptyToNull({
            description: values.description,
            unitPrice: vatToMinors(commaToDot(values.unitPrice)),
            createdAt: new Date(),
          }),
        })
      : await productStore.updateProduct({
          ...emptyToNull({
            id: values.id,
            description: values.description,
            unitPrice: vatToMinors(commaToDot(values.unitPrice)),
          }),
        });
    setTimeout(() => {
      showMessage(translate('common.addedOrUpdated'), { backgroundColor: palette.green });
    }, 1500);
  } catch (e) {
    __DEV__ && console.tron.log(e);
  } finally {
    setVisibleModal({
      type: 'CREATION',
      state: false,
      product: null,
    });
  }
};
