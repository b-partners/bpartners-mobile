import {observer} from 'mobx-react-lite';
import React, {Dispatch, FC, PropsWithoutRef, SetStateAction, useEffect} from 'react';
import {View} from 'react-native';

import {Button, InputField, Loader, Text} from '../../../components';
import {translate} from '../../../i18n';
import {useStores} from '../../../models';
import {color, spacing} from '../../../theme';
import {palette} from '../../../theme/palette';
import {commaToDot} from '../../../utils/comma-to-dot';
import {ProductModalType} from '../products-screen';
import {Controller, useForm} from "react-hook-form";
import {showMessage} from "../../../utils/snackbar";
import {amountToMajors, vatToMinors} from "../../../utils/money";
import {Log} from "../../welcome/utils/utils";

export const ProductForm: FC<PropsWithoutRef<{
    modal: ProductModalType;
    setModal: Dispatch<SetStateAction<ProductModalType>>;
    isKeyboardOpen: boolean;
    isSubjectToVat: boolean;
}>> = observer(props => {
    const {modal, setModal, isKeyboardOpen, isSubjectToVat} = props;

    const {product, type} = modal;

    const {productStore} = useStores();
    const {loadingProductCreation} = productStore;

    const {
        handleSubmit,
        control,
        formState: {errors},
        setValue,
    } = useForm({
        mode: 'all',
        defaultValues: product
    });

    // const hasErrors = errors.unpaidRelaunch || errors.draftRelaunch;

    const onSubmit = async product => {
        const formattedProduct = {
            ...product,
            unitPrice: vatToMinors(commaToDot(product.unitPrice.toString())),
            vatPercent: vatToMinors(product.vatPercent),
        };
        try {
            type === 'CREATION'
                ? await productStore.saveProduct(formattedProduct)
                : await productStore.updateProduct(formattedProduct);
            setTimeout(() => {
                showMessage(translate(type === 'CREATION' ? 'common.added' : 'common.addedOrUpdated'), {backgroundColor: palette.green});
            }, 1000);
        } catch (e) {
            showMessage(translate('errors.somethingWentWrong'), {backgroundColor: palette.pastelRed});
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

    useEffect(() => {
        Log(errors);
    }, [errors]);

    return (
        <View testID='paymentInitiationScreen' style={{height: '100%', width: '100%'}}>
            {isKeyboardOpen && <View style={{width: '100%', height: 50, backgroundColor: palette.secondaryColor}}/>}
            <View style={{
                paddingVertical: spacing[6],
                paddingHorizontal: spacing[3],
                borderWidth: 1,
                borderColor: palette.pastelRed
            }}>
                <Controller
                    control={control}
                    name='unitPrice'
                    rules={{
                        required: translate('errors.required'),
                    }}
                    render={({field: {onChange, value}}) => (
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
                <Controller
                    control={control}
                    name='description'
                    rules={{
                        required: translate('errors.required'),
                    }}
                    render={({field: {onChange, value}}) => (
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
                {isSubjectToVat && (
                    <Controller
                        control={control}
                        name='vatPercent'
                        rules={{
                            required: translate('errors.required'),
                        }}
                        render={({field: {onChange, value}}) => (
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
                )}
            </View>
            <View style={{height: '15%', borderWidth: 1, borderColor: palette.pastelRed}}>
                <Button
                    testID='submit'
                    onPress={handleSubmit(onSubmit)}
                    style={{
                        backgroundColor: color.palette.secondaryColor,
                        height: 45,
                        borderRadius: 25,
                        marginBottom: spacing[6],
                    }}
                    textStyle={{fontSize: 14, fontFamily: 'Geometria-Bold'}}
                >
                    {loadingProductCreation === true ? (
                        <Loader/>
                    ) : (
                        <Text
                            tx={type === 'CREATION' ? 'invoiceFormScreen.productCreationForm.add' : 'invoiceFormScreen.productCreationForm.edit'}/>
                    )}
                </Button>
            </View>
        </View>
    );
});
