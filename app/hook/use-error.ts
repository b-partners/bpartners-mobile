import { useEffect, useState } from 'react';

function useError(initialValue: Error = null) {
  const [error, setError] = useState<Error>(initialValue);
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  return { error, setError };
}

export default useError;
