import axios from 'axios';

import env from '../../config/env';

const baseURL = env.geojsonUrl;

export const geojsonBase = axios.create({
  baseURL,
});
