import * as QueryString from 'query-string';
import React, { useEffect, useState } from 'react';

interface StorybookQueryParams {
  storybook?: boolean;
}

export const ToggleStorybook = props => {
  const [StorybookUIRoot, setStorybookUIRoot] = useState<any>(null);
  const [queryParams, setQueryParams] = useState<StorybookQueryParams>({});

  useEffect(() => {
    if (__DEV__) {
      // Load the storybook UI once
      setStorybookUIRoot(() => require('./storybook').StorybookUIRoot);
    }
  }, []);

  useEffect(() => {
    if (__DEV__) {
      setQueryParams(QueryString.parse(window.location.search));
    }
  }, []);

  if (queryParams?.storybook) {
    return StorybookUIRoot ? <StorybookUIRoot /> : null;
  } else {
    return props.children;
  }
};
