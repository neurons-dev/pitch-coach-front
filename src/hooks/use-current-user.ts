import { useEffect, useState } from 'react';

import { getUserEmail, getUserName } from '@/store/auth-store';

type CurrentUser = {
  name: string | null;
  email: string | null;
};

export function useCurrentUser(): CurrentUser {
  const [user, setUser] = useState<CurrentUser>({ name: null, email: null });

  useEffect(() => {
    Promise.all([getUserName(), getUserEmail()]).then(([name, email]) => {
      setUser({ name, email });
    });
  }, []);

  return user;
}
