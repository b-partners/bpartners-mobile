import React, { useEffect, useState } from 'react';
import { Dimensions, TouchableOpacity, View } from 'react-native';
import { Card, Paragraph, Portal, Title } from 'react-native-paper';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { default as MaterialCommunity, default as MaterialCommunityIcons } from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';

import { Text } from '../../../components';
import { useSheetModal } from '../../../hook';
import { translate } from '../../../i18n';
import { ProspectStatus } from '../../../models/entities/prospect/prospect';
import { color } from '../../../theme';
import { palette } from '../../../theme/palette';
import { datePipe } from '../../../utils/pipes';
import { prospectItemStyles as styles } from '../utils/styles';
import { ProspectItemProps } from '../utils/utils';
import { ProspectStatusModal } from './ProspectStatusModal';
import { ProcessModal } from './process-modal';

const IconGroup = {
  email: <MaterialCommunity name='email' size={18} color={color.palette.secondaryColor} />,
  phone: <MaterialCommunity name='phone' size={18} color={color.palette.secondaryColor} />,
  address: <EntypoIcon name='home' size={18} color={color.palette.secondaryColor} />,
  town: <MaterialCommunityIcons name='city' size={18} color={color.palette.secondaryColor} />,
  comment: <MaterialIcons name={'insert-comment'} size={18} color={color.palette.secondaryColor} />,
  rating: <EntypoIcon name='star' size={18} color={color.palette.secondaryColor} />,
  date: <Octicons name='clock' size={18} color={color.palette.secondaryColor} />,
};

export const ProspectItem: React.FC<ProspectItemProps> = props => {
  const { prospect, setCurrentStatus, menuItem } = props;
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState<ProspectStatus | null>(null);
  const { open } = useSheetModal();

  useEffect(() => {
    status != null && setShowModal(true);
  }, [status]);

  const onEditing = () => {
    setShowModal(true);
    setIsEditing(true);
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content style={styles.rowDirection}>
          <View style={{ width: '80%' }}>
            <Title
              style={{
                fontSize: 16,
                color: palette.black,
              }}
            >
              {prospect.name ? prospect.name : translate('common.noData')}
            </Title>
            <View style={styles.cardBody}>
              <Paragraph style={{ marginRight: 5 }}>{IconGroup.email}</Paragraph>
              <Paragraph style={{ color: palette.black }}>{prospect.email ? <>{prospect.email}</> : translate('common.noData')}</Paragraph>
            </View>
            <View style={styles.rowDirection}>
              <Paragraph style={{ marginRight: 2 }}>{IconGroup.phone}</Paragraph>
              <Paragraph style={{ color: palette.black }}>{prospect.phone ? <> {prospect.phone} </> : translate('common.noData')}</Paragraph>
            </View>
            <View style={styles.rowDirection}>
              <Paragraph style={{ marginRight: 5 }}>{IconGroup.address}</Paragraph>
              <Paragraph style={{ color: palette.black }}>{prospect.address ? <>{prospect.address}</> : translate('common.noData')}</Paragraph>
            </View>
            <View style={styles.rowDirection}>
              <Paragraph style={{ marginRight: 5 }}>{IconGroup.town}</Paragraph>
              <Paragraph style={{ color: palette.black }}>{prospect.townCode ? <>{prospect.townCode}</> : translate('common.noData')}</Paragraph>
            </View>
            <View style={styles.rowDirection}>
              <Paragraph style={{ marginRight: 5 }}>{IconGroup.comment}</Paragraph>
              <Paragraph style={{ color: palette.black }}>{prospect.comment ? <>{prospect.comment}</> : translate('common.noData')}</Paragraph>
            </View>
            <View style={styles.rowDirection}>
              <Paragraph style={{ marginRight: 5 }}>{IconGroup.comment}</Paragraph>
              <Paragraph>{prospect.comment ? <>{prospect.comment}</> : translate('common.noData')}</Paragraph>
            </View>
            <View style={styles.rowDirection}>
              <Paragraph style={{ marginRight: 5 }}>{IconGroup.rating}</Paragraph>
              <Paragraph style={{ color: palette.black }}>
                {prospect.rating && prospect.rating.value > 0 ? <>{prospect.rating.value.toFixed()}</> : translate('common.noData')}
              </Paragraph>
            </View>
            <View style={styles.rowDirection}>
              <Paragraph style={{ marginRight: 5 }}>{IconGroup.date}</Paragraph>
              <Paragraph style={{ color: palette.black }}>
                {prospect.rating && prospect.rating.lastEvaluation ? <>{datePipe(prospect.rating.lastEvaluation).split(' ')[0]}</> : translate('common.noData')}
              </Paragraph>
            </View>
          </View>
          <View style={styles.menuContainer}>
            <TouchableOpacity
              onPress={() =>
                open(<ProspectStatusModal menuItems={menuItem} onEditing={onEditing} setStatus={setStatus} />, {
                  containerStyle: { height: Dimensions.get('screen').height * 0.4 },
                })
              }
            >
              <Text tx={'common.edit'} style={styles.editButton} />
            </TouchableOpacity>
          </View>
        </Card.Content>
      </Card>
      {showModal && (
        <Portal>
          <ProcessModal
            showModal={showModal}
            setShowModal={setShowModal}
            prospect={prospect}
            setCurrentStatus={setCurrentStatus}
            status={status}
            setStatus={setStatus}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        </Portal>
      )}
    </View>
  );
};
