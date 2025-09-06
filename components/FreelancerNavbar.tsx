'use client';

import AtworkLogo from '@/icons/AtworkLogo';
import { Flex, Heading, Separator, Text } from '@radix-ui/themes';
import NotificationIcon from '@/icons/navbar/NotificationIcon';
import Link from 'next/link';
import { ApplicationRoutes } from '@/config/routes';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LucideChevronDown, SearchIcon } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import CopyIcon from '@/icons/client/copy-icon';
import ProposalIcon from '@/icons/navbar/ProposalIcon';
import ProjectIcon from '@/icons/navbar/ProjectIcon';
import { BookmarkIcon } from '@/icons/BookmarkIcon';
import { MessageQuestionIcon } from '@/icons/MessageQuestionIcon';
import SettingsIcon from '@/icons/navbar/SettingsIcon';
import { LoginIcon } from '@/icons/LoginIcon';
import { useXionWallet } from '@/context/xion-context';
import { shortenAddress } from '@/lib/utils';

function ProfileDropdownMenu() {
  const { address, disconnect } = useXionWallet();

  const handleDisconnect = () => {
    console.log('Attempting to disconnect wallet...');
    disconnect();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Flex align={'center'} gap={'2'} className={''}>
          <Image
            src="/avatar/avatar1.svg"
            alt="Company Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <Flex direction={'column'} className={''}>
            <Heading size={'2'}>Human Person</Heading>
            <Text color={'gray'} size={'2'} className={'leading-tight'}>
              {shortenAddress(address!)}
            </Text>
          </Flex>
          <LucideChevronDown size={20} />
        </Flex>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72" align="start">
        <DropdownMenuLabel>
          <Flex align={'center'} gap={'4'} className={''}>
            <Image
              src="/avatar/avatar1.svg"
              alt="Company Logo"
              width={64}
              height={64}
              className="rounded-full mr-2"
            />
            <Flex direction={'column'} className={''}>
              <Heading truncate size={'2'}>
                Human Person
              </Heading>
              <Text
                truncate
                color={'gray'}
                size={'2'}
                className={'leading-tight'}
              >
                Brand & UI/UX Designer
              </Text>
              <Flex align={'center'} gap={'4'}>
                <Text
                  truncate
                  color={'gray'}
                  size={'2'}
                  className={'leading-tight mr-4'}
                >
                  {shortenAddress(address!)}
                </Text>
                <Text>
                  <CopyIcon />
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </DropdownMenuLabel>
        <Separator size={'4'} className={'my-2'} />
        <DropdownMenuGroup>
          <DropdownMenuItem className={'text-muted-foreground'}>
            <ProposalIcon /> My Proposals
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className={'text-muted-foreground'}>
            <ProjectIcon /> Active Jobs
            <DropdownMenuShortcut>⌘J</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className={'text-muted-foreground'}>
            <BookmarkIcon /> Bookmarked Jobs
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className={'text-muted-foreground'}>
            <MessageQuestionIcon /> Job History
            <DropdownMenuShortcut>⌘H</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className={'text-muted-foreground'}>
            <SettingsIcon /> Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className={'text-destructive'}
          onClick={handleDisconnect}
        >
          <LoginIcon /> Sign Out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem className={'w-full'}>
          <Flex align={'center'} justify={'between'} className={'w-full'}>
            <Text color={'gray'} size={'1'} className={'w-full'}>
              Privacy Policy
            </Text>
            <Text
              align={'right'}
              color={'gray'}
              size={'1'}
              className={'w-full'}
            >
              Terms & Conditions
            </Text>
          </Flex>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function FreelancerNavbar() {
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

  return (
    <Flex
      position={'sticky'}
      top={'0'}
      left={'0'}
      right={'0'}
      className="py-4 z-50 bg-muted"
      align="center"
      justify="between"
    >
      <Link href={'/'}>
        <AtworkLogo />
      </Link>
      <div className="flex items-center gap-4"></div>

      <Flex align="center" gap="5">
        <Link href={ApplicationRoutes.SETTINGS}>
          <SearchIcon strokeWidth={1} className={'text-foreground'} />
        </Link>
        <NotificationIcon />
        <Text>{'100.50'} ATOM</Text>
        <ProfileDropdownMenu />
      </Flex>
    </Flex>
  );
}
