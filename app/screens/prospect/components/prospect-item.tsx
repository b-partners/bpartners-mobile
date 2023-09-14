import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View } from 'react-native';
import { Card, Paragraph, Portal, Title } from 'react-native-paper';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons';

import { Menu as CMenu } from '../../../components/menu/menu';
import { translate } from '../../../i18n';
import { ProspectStatus } from '../../../models/entities/prospect/prospect';
import { color } from '../../../theme';
import { palette } from '../../../theme/palette';
import { datePipe } from '../../../utils/pipes';
import { prospectItemStyles as styles } from '../utils/styles';
import { ProspectItemProps } from '../utils/utils';
import { Location } from './location';
import { ProcessModal } from './process-modal';

const IconGroup = {
  email: <MaterialCommunity name='email' size={18} color={color.palette.secondaryColor} />,
  phone: <MaterialCommunity name='phone' size={18} color={color.palette.secondaryColor} />,
  address: <EntypoIcon name='home' size={18} color={color.palette.secondaryColor} />,
  town: <MaterialCommunityIcons name='city' size={18} color={color.palette.secondaryColor} />,
  rating: <EntypoIcon name='star' size={18} color={color.palette.secondaryColor} />,
  date: <Octicons name='clock' size={18} color={color.palette.secondaryColor} />,
};

export const ProspectItem: React.FC<ProspectItemProps> = props => {
  const { menuItem, prospect, setCurrentStatus, key } = props;
  const [showModal, setShowModal] = useState(false);

  return (
    <View key={key} style={styles.container}>
      <Card style={styles.card}>
        <Card.Content style={styles.rowDirection}>
          <View style={{ width: '80%' }}>
            <Title style={{ fontSize: 16 }}>{prospect.name ? prospect.name : translate('common.noData')}</Title>
            <View style={styles.cardBody}>
              <Paragraph style={{ marginRight: 5 }}>{IconGroup.email}</Paragraph>
              <Paragraph>{prospect.email ? <>{prospect.email}</> : translate('common.noData')}</Paragraph>
            </View>
            <View style={styles.rowDirection}>
              <Paragraph style={{ marginRight: 2 }}>{IconGroup.phone}</Paragraph>
              <Paragraph>{prospect.phone ? <> {prospect.phone} </> : translate('common.noData')}</Paragraph>
            </View>
            <View style={styles.rowDirection}>
              <Paragraph style={{ marginRight: 5 }}>{IconGroup.address}</Paragraph>
              <Paragraph>{prospect.address ? <>{prospect.address}</> : translate('common.noData')}</Paragraph>
            </View>
            <View style={styles.rowDirection}>
              <Paragraph style={{ marginRight: 5 }}>{IconGroup.town}</Paragraph>
              <Paragraph>{prospect.townCode ? <>{prospect.townCode}</> : translate('common.noData')}</Paragraph>
            </View>
            <View style={styles.rowDirection}>
              <Paragraph style={{ marginRight: 5 }}>{IconGroup.rating}</Paragraph>
              <Paragraph>{prospect.rating && prospect.rating.value > 0 ? <>{prospect.rating.value.toFixed()}</> : translate('common.noData')}</Paragraph>
            </View>
            <View style={styles.rowDirection}>
              <Paragraph style={{ marginRight: 5 }}>{IconGroup.date}</Paragraph>
              <Paragraph>
                {prospect.rating && prospect.rating.lastEvaluation ? <>{datePipe(prospect.rating.lastEvaluation).split(' ')[0]}</> : translate('common.noData')}
              </Paragraph>
            </View>
          </View>
          <View style={styles.location}>{prospect.location && <Location prospect={prospect} />}</View>
          <View style={styles.menuContainer}>
            <CMenu
              items={menuItem}
              actions={{
                toContact: () => {
                  prospect.status !== ProspectStatus.TO_CONTACT && setShowModal(true);
                },
                contacted: () => {
                  prospect.status !== ProspectStatus.CONTACTED && setShowModal(true);
                },
                converted: () => {
                  prospect.status !== ProspectStatus.CONVERTED && setShowModal(true);
                },
              }}
            >
              <MaterialCommunityIcons name='dots-vertical' size={21} color={palette.secondaryColor} />
            </CMenu>
          </View>
        </Card.Content>
      </Card>
      {showModal && (
        <Portal>
          <ProcessModal showModal={showModal} setShowModal={setShowModal} prospect={prospect} setCurrentStatus={setCurrentStatus} />
        </Portal>
      )}
    </View>
  );
};
