import * as Sentry from '@sentry/react-native';

type Severity = 'log' | 'info' | 'error' | 'fatal';
const sendLog = (message: string, logLevel: Severity = 'log') => {
  Sentry.captureMessage(message, logLevel);
};

type ExtrasParams = Record<string, unknown>;
export const sendError = (exception: any, extras?: ExtrasParams) => {
  Sentry.captureException(exception, { extra: extras });
};

export default sendLog;
