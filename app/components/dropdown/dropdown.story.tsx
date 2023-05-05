import { storiesOf } from '@storybook/react-native';
import * as React from 'react';

import { Story, StoryScreen, UseCase } from '../../../storybook/views';
import { TransactionCategory } from '../../models/entities/transaction-category/transaction-category';
import { Dropdown } from './dropdown';

declare let module;

const MockData: TransactionCategory[] = [
  {
    id: '1',
    userDefined: false,
    type: 'Item 1',
    vat: 1,
  },
  {
    id: '2',
    userDefined: false,
    type: 'Item 2',
    vat: 2,
  },
  {
    id: '3',
    userDefined: false,
    type: 'Item 3',
    vat: 3,
  },
];

const MockCategory: TransactionCategory = {
  id: '2',
  userDefined: false,
  type: 'Item 2',
  vat: 2,
};

storiesOf('Dropdown', module)
  .addDecorator(fn => <StoryScreen>{fn()}</StoryScreen>)
  .add('Style Presets', () => (
    <Story>
      <UseCase text='With require()'>
        <Dropdown
          items={MockData}
          value={MockCategory}
          selectValue={transactionCategory => transactionCategory.id}
          selectLabel={transactionCategory => transactionCategory.type}
          onSelectItem={() => null}
        />
      </UseCase>
    </Story>
  ));
