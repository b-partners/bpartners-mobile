import { RTLog } from '../../../utils/reactotron-log';
import AWS from 'aws-sdk/dist/aws-sdk-react-native';

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
