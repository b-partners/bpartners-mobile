import { Story, StoryScreen, UseCase } from '../../../storybook/views';
import { Icon } from './icon';
import { storiesOf } from '@storybook/react-native';
import * as React from 'react';

declare let module;

storiesOf('Icon', module)
  .addDecorator(fn => <StoryScreen>{fn()}</StoryScreen>)
  .add('Names', () => (
    <Story>
      <UseCase text='back' usage='The icon for going back'>
        <Icon icon='back' />
      </UseCase>
      <UseCase text='bullet' usage='The icon for a bullet point'>
        <Icon icon='bullet' />
      </UseCase>
    </Story>
  ));
