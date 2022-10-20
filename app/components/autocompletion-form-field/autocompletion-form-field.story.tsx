import * as React from 'react';
import {storiesOf} from '@storybook/react-native';
import {Story, StoryScreen, UseCase} from '../../../storybook/views';
import {TAutocompleteDropdownItem} from 'react-native-autocomplete-dropdown';
import {AutocompletionFormField} from './autocompletion-form-field';

declare let module;

const dataSet = [
  {id: '1', title: 'Alpha', description: 'description1'},
  {id: '2', title: 'Beta', description: 'description2'},
  {id: '3', title: 'Gamma', description: 'description3'},
  {id: '4', title: 'Epsilon', description: 'description4'},
];

const USE_CASE_STYLE = {paddingBottom: '50%'};
storiesOf('AutocompletionFormField', module)
  .addDecorator(fn => <StoryScreen>{fn()}</StoryScreen>)
  .add('Behaviour', () => (
    <Story>
      <UseCase text={'With initial value'} style={USE_CASE_STYLE}>
        <AutocompletionFormField
          data={[...dataSet]}
          onSelectItem={(item: TAutocompleteDropdownItem): void => {
            console.log('item title: ' + item?.title);
          }}
          onChangeText={(text: string): void => {
            console.log('current text' + text);
          }}
          value={'1'}
        />
      </UseCase>
      <UseCase text={'Without initial value'} style={USE_CASE_STYLE}>
        <AutocompletionFormField
          data={[...dataSet]}
          onSelectItem={(item: TAutocompleteDropdownItem): void => {
            console.log('item title: ' + item?.title);
          }}
          onChangeText={(text: string): void => {
            console.log('current text' + text);
          }}
          value={''}
        />
      </UseCase>
    </Story>
  ))
  .add('Overrides props', () => (
    <Story>
      <UseCase text={'Override the item title key'} usage={'Use without initial value'} style={USE_CASE_STYLE}>
        <AutocompletionFormField
          data={[...dataSet]}
          titleKey={'description'}
          onSelectItem={(item: TAutocompleteDropdownItem): void => {
            console.log('item title: ' + item?.title);
          }}
          onChangeText={(text: string): void => {
            console.log('current text' + text);
          }}
          value={''}
        />
      </UseCase>
      <UseCase text={'Override the item id key'} usage={'Use with initial value'} style={USE_CASE_STYLE}>
        <AutocompletionFormField
          data={[...dataSet]}
          idKey={'description'}
          titleKey={'title'}
          onSelectItem={(item: TAutocompleteDropdownItem): void => {
            console.log('item title: ' + item?.title);
          }}
          onChangeText={(text: string): void => {
            console.log('current text' + text);
          }}
          value={'description3'}
        />
      </UseCase>
    </Story>
  ));
