'use client';

import {  useState } from 'react';
import Cookies from 'js-cookie';

export function useAuth() {
  const [accessToken, _setAccessToken] = useState(
    () => Cookies.get('accessToken') || null,
  );
  const [userRole, _setUserRole] = useState(
    () => Cookies.get('userRole') || null,
  );
  const [walletAddress, _setWalletAddress] = useState(
    () => Cookies.get('walletAddress') || null,
  );
  const [userId, _setUserId] = useState(() => Cookies.get('userId') || null);

  return {
    accessToken,
    userRole,
    walletAddress,
    userId,
  };
}
