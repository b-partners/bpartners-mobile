import React, {useState} from 'react';
import {palette} from "../../../theme/palette";
import {spacing} from "../../../theme";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {Text} from "../../../components";
import {Button as IButton, Portal} from "react-native-paper";
import {ProspectCreationModal} from "./prospect-creation-modal";
import {ProspectStatus} from "../../../models/entities/prospect/prospect";

export const CreationPortal = () => {
    const [creationModal, setCreationModal] = useState(false);
    const [status, setStatus] = useState<ProspectStatus>();

    return (
        <>
            <IButton
                compact={true}
                buttonColor={palette.secondaryColor}
                textColor={palette.white}
                style={{
                    width: 100,
                    height: 40,
                    borderRadius: 10,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    alignContent: 'center',
                    marginTop: spacing[4],
                }}
                onPress={() => {
                    setCreationModal(true);
                }}
            >
                <MaterialCommunityIcons name='plus' size={20} color={palette.white}/>
                <Text tx={'common.create'} style={{fontSize: 14}}/>
            </IButton>
            {creationModal && (
                <Portal>
                    <ProspectCreationModal showModal={creationModal} setShowModal={setCreationModal} status={status}
                                           setStatus={setStatus}/>
                </Portal>
            )}
        </>
    );
};
