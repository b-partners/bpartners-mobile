import AWS from 'aws-sdk/dist/aws-sdk-react-native';

import { RTLog } from '../../../utils/reactotron-log';

export const createARNAsync = params =>
  new Promise((resolve, reject) => {
    const sns = new AWS.SNS();
    sns.createPlatformEndpoint(params, (err, data) => {
      RTLog('Endpoint created', err, data);
      if (err || !data.EndpointArn) {
        return err ? reject(err) : reject('ARN is missing');
      }
      resolve(data.EndpointArn);
    });
  });
export const getAttributesAsync = params =>
  new Promise((resolve, reject) => {
    const sns = new AWS.SNS();
    sns.getEndpointAttributes(params, (err, data) => {
      RTLog('Attrs', err, data);
      if (err || !data.Attributes) {
        return err ? reject(err) : reject('Attributes are missing in the response');
      }
      resolve(data.Attributes);
    });
  });
