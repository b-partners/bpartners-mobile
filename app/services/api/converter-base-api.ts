import axios from 'axios';

import env from '../../config/env';

const baseURL = env.converterUrl;

export const converterBase = axios.create({
  baseURL,
});
