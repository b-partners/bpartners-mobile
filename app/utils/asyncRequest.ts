import { translate } from '../i18n';
import { palette } from '../theme/palette';
import { showMessage } from './snackbar';

export async function handleAsyncRequest<T>(promiseFunction: () => Promise<T>): Promise<void> {
  try {
    await promiseFunction();
  } catch {
    showMessage(translate('errors.somethingWentWrong'), { backgroundColor: palette.pastelRed });
  }
}
