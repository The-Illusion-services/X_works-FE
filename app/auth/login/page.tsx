'use client';

import React, { useEffect, useState } from 'react';

import { toast } from 'sonner';

import Cookies from 'js-cookie';

import { useRouter } from 'next/navigation';

import {
  Abstraxion,
  useAbstraxionAccount,
  useModal,
  useAbstraxionSigningClient,
} from '@burnt-labs/abstraxion';
import { useAuth } from '@/hooks/useAuth';

const Page = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // Add hydration check
  const { client, signArb, logout } = useAbstraxionSigningClient();

  // Add state to track signing process and prevent duplicates
  const [isSigningInProgress, setIsSigningInProgress] = useState(false);
  const [hasAttemptedSign, setHasAttemptedSign] = useState(false);

  const { accessToken } = useAuth();

  // Remove dynamic content that causes hydration issues
  const arbitraryMessage = `Welcome to authentication!\n\nSign this message to authenticate.\n\nPlease confirm your identity.`;

  const [, setShow] = useModal();
  const {
    data: { bech32Address },
    isConnected,
  } = useAbstraxionAccount();

  // Optimized verify function with error handling
  const verifyArbitraryMessage = async (signature: string | undefined) => {
    setIsLoading(true);
    if (!signature || !client) return false;

    setIsSigningInProgress(true);

    try {
      const granteeAccountData = await client.getGranteeAccountData();
      if (!granteeAccountData) {
        console.error('No grantee account data available');
        return false;
      }

      const userSessionPubKey = Buffer.from(granteeAccountData.pubkey).toString(
        'base64',
      );

      const response = await fetch(
        `https://x-works-be.onrender.com/api/accounts/verify-signature/`,
        {
          method: 'POST',
          body: JSON.stringify({
            xion_address: bech32Address,
            address: client.granteeAddress,
            message: arbitraryMessage,
            signature,
            pubkey: userSessionPubKey,
            role: 'Creator',
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Verification failed: ${response.status}`);
      }

      const responseData = await response.json();
      const {
        access: access_token,
        user_id: userId,
        xion_address: walletAddress,
        role: userRole,
      } = responseData;

      if (access_token) {
        Cookies.set('accessToken', access_token, {
          expires: 360,
          secure: true,
        });
        Cookies.set('userId', userId, {
          expires: 360,
          secure: true,
        });
        Cookies.set('walletAddress', walletAddress, {
          expires: 360,
          secure: true,
        });
        if (userRole) {
          Cookies.set('role', userRole, {
            expires: 360,
            secure: true,
          });
        }

        // Show success message
        toast.success('Successfully signed in!');
      }
    } catch (err) {
      console.error('Verification error:', err);
      toast.error('Authentication failed. Please try again.');
      // Reset states to allow retry
      setHasAttemptedSign(false);
    } finally {
      setIsSigningInProgress(false);
      setIsLoading(false);
    }

    return false;
  };

  // Optimized sign handler with duplicate prevention
  const handleSign = async (granteeAddress: string): Promise<void> => {
    // Prevent multiple simultaneous signing attempts
    if (isSigningInProgress || hasAttemptedSign) {
      console.log('Sign operation already in progress or completed');
      return;
    }

    if (!client?.granteeAddress) {
      console.error('No grantee address available');
      return;
    }

    setHasAttemptedSign(true);
    setIsSigningInProgress(true);

    try {
      const response = await signArb?.(granteeAddress, arbitraryMessage);
      if (response) {
        await verifyArbitraryMessage(response);
      }
    } catch (error) {
      console.error('Signing error:', error);
      setHasAttemptedSign(false); // Reset on error to allow retry
      setIsSigningInProgress(false);
      toast.error('Signing failed. Please try again.');
    }
  };

  // Handle client-side mounting to prevent hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Optimized useEffect with better condition checking
  useEffect(() => {
    // Skip if already authenticated
    if (accessToken) {
      console.log('User already authenticated');
      return;
    }

    // Skip if not connected or signing in progress
    if (!isConnected || isSigningInProgress || hasAttemptedSign) {
      console.log('Skipping sign process due to connection state');
      return;
    }

    // Only proceed if we have a grantee address and no existing session
    if (client?.granteeAddress) {
      handleSign(client?.granteeAddress);
    }
  });

  // Reset signing state when disconnected
  useEffect(() => {
    if (!isConnected) {
      setHasAttemptedSign(false);
      setIsSigningInProgress(false);
    }
  }, [isConnected]);

  const handleLogout = () => {
    setIsLoading(true);
    if (logout)
      try {
        logout();
        router.push('/auth/login');
        localStorage.removeItem('lastVisitedPage');
        Cookies.remove('accessToken');
        Cookies.remove('userId');
        Cookies.remove('walletAddress');
        Cookies.remove('role');
        toast.success('Successfully logged out');
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        setIsLoading(false);
      }
  };

  // Spinner component
  const Spinner = () => (
    <svg
      className="animate-spin -ml-1 mr-3 h-5 w-5 text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  // Get button text based on current state - only after mounting
  const getButtonText = () => {
    if (!isMounted) {
      return 'Sign in as a Freelancer'; // Default state for SSR
    }

    if (isSigningInProgress) {
      return 'Signing In...';
    }
    if (bech32Address && accessToken) {
      return 'Sign Out';
    }
    return 'Sign in as a Freelancer';
  };

  // Check if button should be disabled
  const isButtonDisabled = !isMounted || isSigningInProgress || isLoading;

  return (
    <main className="h-full lg:w-full w-screen flex lg:flex-row flex-col capitalize  min-h-screen justify-center">
      <div className="flex flex-col h-screen w-full lg:w-[50%] items-center justify-center ">
        <div className="lg:w-[500px] h-full flex flex-col gap-y-6 px-6 py-8 bg-blue-secondary text-white items-center justify-center">
          <div className="p-0 text-center text-gray-950">
            <h2 className="text-2xl font-bold text-gray-950">Welcome Back</h2>
            <span className="pb-4 text-border-secondary">
              Sign in to acccess your account
            </span>
          </div>

          <div className="p-0 flex flex-col gap-y-5 lg:w-full w-[100%]">
            <button
              onClick={() => {
                if (!isMounted) return; // Prevent action before hydration

                if (bech32Address && accessToken) {
                  handleLogout();
                } else {
                  setShow(true);
                }
              }}
              disabled={isButtonDisabled}
              className={`
                bg-primary lg:w-full p-2 text-white rounded-md 
                transition-colors duration-300 flex items-center justify-center
                ${
                  isButtonDisabled
                    ? 'opacity-70 cursor-not-allowed'
                    : 'hover:bg-blue-secondary-hover'
                }
              `}
            >
              {isMounted && isSigningInProgress && <Spinner />}
              {getButtonText()}
            </button>
          </div>
        </div>
      </div>
      <Abstraxion onClose={() => setShow(false)} />
    </main>
  );
};

export default Page;
