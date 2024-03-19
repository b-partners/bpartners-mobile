import React, {useState} from 'react';

import {Text} from '../../../components';
import {spacing} from '../../../theme';
import {palette} from '../../../theme/palette';
import {Button as IButton, Portal} from "react-native-paper";
import {ExportAccountModal} from "./export-accounting-modal";

export const ExportingAccountingButton = () => {
    const [exportModal, setExportModal] = useState(false);

    return (
        <>
            <IButton
                compact={true}
                buttonColor={palette.secondaryColor}
                textColor={palette.white}
                style={{
                    width: 130,
                    height: 40,
                    borderRadius: 10,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignContent: 'center',
                    marginTop: spacing[4],
                }}
                onPress={() => {
                    setExportModal(true);
                }}
            >
                <Text tx={'exportAccounting.title'} style={{fontSize: 14}}/>
            </IButton>
            {exportModal && (
                <Portal>
                    <ExportAccountModal showModal={exportModal} setShowModal={setExportModal} />
                </Portal>
            )}
        </>
    );
};
