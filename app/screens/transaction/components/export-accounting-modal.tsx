import React, {useState} from 'react';
import {View} from 'react-native';
import {Modal} from 'react-native-paper';
import {Controller, useForm} from "react-hook-form";

import {DatePickerField, Text} from '../../../components';
import {palette} from '../../../theme/palette';
import {spacing} from "../../../theme";
import {ExportModalProps} from '../utils/utils';
import {translate} from "../../../i18n";
import {showMessage} from "../../../utils/snackbar";
import {Log} from "../../welcome/utils/utils";
import {KeyboardLayout} from "../../../components/keyboard-layout/KeyboardLayout";
import {
    DATE_PICKER_CONTAINER_STYLE,
    DATE_PICKER_LABEL_STYLE,
    DATE_PICKER_TEXT_STYLE
} from "../../invoice-form/components/utils";

export const ExportAccountModal: React.FC<ExportModalProps> = props => {
    const {showModal, setShowModal} = props;

    const [loading, setLoading] = useState(true);
    const [keyboardOpen, setKeyboardOpen] = useState(false);

    const closeModal = () => {
        setShowModal(false);
    }

    const {
        handleSubmit,
        control,
        formState: {errors},
    } = useForm({
        mode: 'all',
    });

    const hasErrors = errors.unpaidRelaunch || errors.draftRelaunch;

    const onSubmit = async configurations => {
        setLoading(true);
        try {
            // await invoiceStore.updateInvoiceRelaunchConf(configurations);
            Log(configurations);
            showMessage(translate('common.addedOrUpdated'), {backgroundColor: palette.green});
        } catch (e) {
            showMessage(translate('errors.somethingWentWrong'), {backgroundColor: palette.pastelRed});
            throw e;
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardLayout setKeyboardOpen={setKeyboardOpen}>
            <Modal
                visible={showModal}
                dismissableBackButton={true}
                onDismiss={closeModal}
                style={{
                    width: '100%',
                    height: '100%',
                    justifyContent: keyboardOpen ? 'flex-start' : 'center',
                }}
            >
                <View
                    style={{
                        backgroundColor: palette.white,
                        borderRadius: 20,
                        marginHorizontal: '2%',
                        padding: '5%',
                        width: '96%',
                        height: 450,
                    }}
                >
                    <Text tx={'exportAccounting.title'} style={{color: palette.black, fontSize: 20}}/>
                    <Text
                        tx={'exportAccounting.chooseTransactionPeriod'}
                        style={{color: palette.black, fontSize: 16, paddingVertical: spacing[4]}}
                    />
                    <View style={{height: 190, display: 'flex', justifyContent: 'space-between'}}>
                        <Controller
                            control={control}
                            name='from'
                            defaultValue={new Date()}
                            render={({field: {onChange, value}}) => (
                                <DatePickerField
                                    labelTx='calendarScreen.eventEditionModal.from'
                                    isButtonPreset={false}
                                    labelStyle={DATE_PICKER_LABEL_STYLE}
                                    containerStyle={{...DATE_PICKER_CONTAINER_STYLE, maxHeight: 80}}
                                    textStyle={DATE_PICKER_TEXT_STYLE}
                                    dateSeparator='/'
                                    value={value}
                                    onDateChange={onChange}
                                    type={'datetime'}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name='to'
                            defaultValue={new Date()}
                            render={({field: {onChange, value}}) => (
                                <DatePickerField
                                    labelTx='calendarScreen.eventEditionModal.to'
                                    isButtonPreset={false}
                                    labelStyle={DATE_PICKER_LABEL_STYLE}
                                    containerStyle={{...DATE_PICKER_CONTAINER_STYLE, maxHeight: 80}}
                                    textStyle={DATE_PICKER_TEXT_STYLE}
                                    dateSeparator='/'
                                    value={value}
                                    onDateChange={onChange}
                                    type={'datetime'}
                                />
                            )}
                        />
                    </View>
                </View>
            </Modal>
        </KeyboardLayout>
    );
};
