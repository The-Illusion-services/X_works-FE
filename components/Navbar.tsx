'use client';

import AtworkLogo from '@/icons/AtworkLogo';
import { Flex } from '@radix-ui/themes';
import Link from 'next/link';
import { ApplicationRoutes } from '@/config/routes';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useXionWallet } from '@/context/xion-context';
import { Button } from '@/components/ui/button';
import { UserTypeModal } from '@/components/UserTypeModal';

export default function Navbar() {
  const { isConnected, connect } = useXionWallet();
  const router = useRouter();
  const pathname = usePathname();
  const isClientDashboardRoute = pathname.endsWith(
    ApplicationRoutes.CLIENT_DASHBOARD,
  );
  const isClientProjectsRoute = pathname.endsWith(
    ApplicationRoutes.CLIENT_PROJECTS,
  );
  const isClientProposalRoute = pathname.endsWith(
    ApplicationRoutes.CLIENT_PROPOSALS,
  );
  const [, setAuthError] = useState<string | null>(null);

  const [, setTabValue] = useState<string>('');

  useEffect(() => {
    // Prefetch the routes to ensure they are ready for navigation
    router.prefetch(ApplicationRoutes.CLIENT_DASHBOARD);
    router.prefetch(ApplicationRoutes.CLIENT_PROJECTS);
    router.prefetch(ApplicationRoutes.CLIENT_PROPOSALS);

    if (isClientDashboardRoute) {
      setTabValue('dashboard');
    } else if (isClientProjectsRoute) {
      setTabValue('project');
    } else if (isClientProposalRoute) {
      setTabValue('proposal');
    } else {
      setTabValue('');
    }
  }, [
    router,
    pathname,
    isClientDashboardRoute,
    isClientProjectsRoute,
    isClientProposalRoute,
  ]);

  const handleConnect = async () => {
    try {
      setAuthError(null);
      await connect();
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setAuthError('Failed to connect to Xion wallet. Please try again.');
    }
  };

  return (
    <Flex
      position={'sticky'}
      top={'0'}
      left={'0'}
      right={'0'}
      className="py-4 z-50 bg-[#ffffff1A] backdrop-blur-[7px]"
      align="center"
      justify="between"
    >
      <Link href={'/'}>
        <AtworkLogo />
      </Link>
      <div className="hidden md:flex items-center gap-12">
        <Link href={ApplicationRoutes.ABOUT}>About</Link>
        <Link href={ApplicationRoutes.SERVICES}>Services</Link>
        <Link href={ApplicationRoutes.HOW_IT_WORKS}>How it works</Link>
      </div>

      <Flex align="center" gap="5">
        {!isConnected ? (
          <Button onClick={handleConnect} className="text-white">
            Connect Wallet
          </Button>
        ) : (
          /*<Link href={ApplicationRoutes.JOIN}>
            <Button className="bg-primary rounded-md py-4 px-6 font-circular text-white font-medium">
              Select your role
            </Button>
          </Link>*/
          <UserTypeModal />
        )}
      </Flex>
    </Flex>
  );
}
