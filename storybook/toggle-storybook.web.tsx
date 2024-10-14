import queryString from 'query-string';
import React, { useEffect, useState } from 'react';

import { StorybookUIRoot as StorybookUIRootComponent } from './storybook';

interface StorybookQueryParams {
  storybook?: boolean;
}

export const ToggleStorybook = (props: any) => {
  const [StorybookUIRoot, setStorybookUIRoot] = useState<any>(null);
  const [queryParams, setQueryParams] = useState<StorybookQueryParams>({});

  useEffect(() => {
    if (__DEV__) {
      // Load the storybook UI once
      setStorybookUIRoot(() => StorybookUIRootComponent);
    }
  }, []);

  useEffect(() => {
    if (__DEV__) {
      setQueryParams(queryString.parse(window.location.search));
    }
  }, []);

  if (queryParams?.storybook) {
    return StorybookUIRoot ? <StorybookUIRoot /> : null;
  } else {
    return props.children;
  }
};
