import { Prospect, UpdateProspect } from '@bpartners/typescript-client';

export const prospectMapper = {
  prospectToUpdateProspect: (prospect: Prospect): UpdateProspect => {
    const { address, email, firstName, managerName, id, name, phone, status, townCode } = prospect || {};
    return { address, email, firstName, managerName, id, name, phone, status, townCode };
  },
};
