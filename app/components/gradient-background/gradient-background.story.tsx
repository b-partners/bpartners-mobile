import { Story, StoryScreen, UseCase } from '../../../storybook/views';
import { GradientBackground } from './gradient-background';
import { storiesOf } from '@storybook/react-native';
import * as React from 'react';

declare let module;

storiesOf('GradientBackground', module)
  .addDecorator(fn => <StoryScreen>{fn()}</StoryScreen>)
  .add('Style Presets', () => (
    <Story>
      <UseCase text='default/stretch' usage='Full screen background gradient.'>
        <GradientBackground colors={['#422443', '#281b34']} />
      </UseCase>
    </Story>
  ));
