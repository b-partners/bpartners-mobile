import { MaterialCommunityIcons } from '@expo/vector-icons';
import { observer } from 'mobx-react-lite';
import React, { Dispatch, FC, PropsWithoutRef, SetStateAction, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { TouchableOpacity, View } from 'react-native';

import { InputField, Loader, Text } from '../../../components';
import { translate } from '../../../i18n';
import { useStores } from '../../../models';
import { color, spacing } from '../../../theme';
import { palette } from '../../../theme/palette';
import { commaToDot } from '../../../utils/comma-to-dot';
import { amountToMajors, vatToMinors } from '../../../utils/money';
import { showMessage } from '../../../utils/snackbar';
import { ProductModalType } from '../products-screen';
import { productFormSchema } from '../utils/utils';

export const ProductForm: FC<
  PropsWithoutRef<{
    modal: ProductModalType;
    setModal: Dispatch<SetStateAction<ProductModalType>>;
    isKeyboardOpen: boolean;
    isSubjectToVat: boolean;
  }>
> = observer(props => {
  const { modal, setModal, isKeyboardOpen, isSubjectToVat } = props;

  const { product, type } = modal;

  const { productStore } = useStores();
  const { loadingProductCreation } = productStore;

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm({
    mode: 'all',
    defaultValues: product,
  });

  const hasErrors = errors.unitPrice || errors.vatPercent || errors.description;

  const onSubmit = async formData => {
    const formattedProduct = {
      ...formData,
      unitPrice: vatToMinors(commaToDot(formData.unitPrice.toString())),
      vatPercent: vatToMinors(formData.vatPercent),
    };
    try {
      type === 'CREATION' ? await productStore.saveProduct(formattedProduct) : await productStore.updateProduct(formattedProduct);
      setTimeout(() => {
        showMessage(translate(type === 'CREATION' ? 'common.added' : 'common.addedOrUpdated'), { backgroundColor: palette.green });
      }, 1000);
    } catch (e) {
      showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.pastelRed });
      throw e;
    } finally {
      setModal({
        type: 'CREATION',
        state: false,
        product: null,
      });
    }
  };

  useEffect(() => {
    if (product) {
      setValue('unitPrice', amountToMajors(product?.unitPrice));
      setValue('vatPercent', amountToMajors(product?.vatPercent));
    }
  }, [product, setValue]);

  return (
    <View testID='paymentInitiationScreen' style={{ height: '100%', width: '100%' }}>
      {isKeyboardOpen && <View style={{ width: '100%', height: 50, backgroundColor: palette.secondaryColor }} />}
      <View
        style={{
          marginVertical: spacing[5],
          paddingHorizontal: spacing[3],
        }}
      >
        <View style={{ marginBottom: spacing[4] }}>
          <Controller
            control={control}
            name='unitPrice'
            rules={productFormSchema.unitPrice}
            render={({ field: { onChange, value } }) => (
              <InputField
                labelTx={'invoiceFormScreen.productCreationForm.unitPrice'}
                keyboardType={'numeric'}
                error={!!errors.unitPrice}
                value={value?.toString()}
                onChange={onChange}
                errorMessage={errors.unitPrice?.message as string}
                backgroundColor={palette.white}
              />
            )}
          />
        </View>
        <View style={{ marginBottom: spacing[4] }}>
          <Controller
            control={control}
            name='description'
            rules={productFormSchema.description}
            render={({ field: { onChange, value } }) => (
              <InputField
                labelTx={'invoiceFormScreen.productCreationForm.description'}
                error={!!errors.description}
                value={value}
                onChange={onChange}
                errorMessage={errors.description?.message as string}
                backgroundColor={palette.white}
              />
            )}
          />
        </View>
        {isSubjectToVat && (
          <View style={{ marginBottom: spacing[4] }}>
            <Controller
              control={control}
              name='vatPercent'
              rules={productFormSchema.vatPercent}
              render={({ field: { onChange, value } }) => (
                <InputField
                  labelTx={'invoiceFormScreen.productCreationForm.tva'}
                  keyboardType={'numeric'}
                  error={!!errors.vatPercent}
                  value={value?.toString()}
                  onChange={onChange}
                  errorMessage={errors.vatPercent?.message as string}
                  backgroundColor={palette.white}
                />
              )}
            />
          </View>
        )}
      </View>
      <View style={{ height: '15%', marginHorizontal: spacing[3] }}>
        {hasErrors ? (
          <TouchableOpacity
            style={{
              position: 'relative',
              backgroundColor: palette.lighterGrey,
              width: '100%',
              height: 40,
              alignSelf: 'center',
              borderRadius: 5,
              justifyContent: 'center',
              flexDirection: 'row',
              borderWidth: 1,
              borderColor: palette.lighterGrey,
            }}
            onPress={() => {}}
          >
            <View style={{ justifyContent: 'center', marginRight: 8 }}>
              <MaterialCommunityIcons name={type === 'CREATE' ? 'plus' : 'pencil'} size={22} color={color.palette.white} />
            </View>
            <View style={{ justifyContent: 'center' }}>
              <Text tx={type === 'CREATION' ? 'invoiceFormScreen.productCreationForm.add' : 'invoiceFormScreen.productCreationForm.edit'} />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{
              position: 'relative',
              backgroundColor: palette.secondaryColor,
              width: '100%',
              height: 40,
              alignSelf: 'center',
              borderRadius: 5,
              justifyContent: 'center',
              flexDirection: 'row',
              borderWidth: 1,
              borderColor: palette.secondaryColor,
            }}
            onPress={handleSubmit(onSubmit)}
          >
            <View style={{ justifyContent: 'center', marginRight: 8 }}>
              {loadingProductCreation ? (
                <Loader size={22} color={palette.white} />
              ) : (
                <MaterialCommunityIcons name={type === 'CREATION' ? 'plus' : 'pencil'} size={22} color={color.palette.white} />
              )}
            </View>
            <View style={{ justifyContent: 'center' }}>
              <Text tx={type === 'CREATION' ? 'invoiceFormScreen.productCreationForm.add' : 'invoiceFormScreen.productCreationForm.edit'} />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
});
