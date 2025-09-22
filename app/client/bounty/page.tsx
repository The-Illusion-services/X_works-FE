'use client';
import React, { useEffect, useState } from 'react';
// import { IoIosSearch } from 'react-icons/io';
// import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import BountyDetailModal from './BountyDetailModal';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ApplicationRoutes } from '@/config/routes';
import { useRouter } from 'next/navigation';
import { useXionWallet } from '@/context/xion-context';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/context/auth-context';
import { useAuth } from '@/hooks/useAuth';

type Bounty = {
  id: string;
  title: string;
  status: string;
  category: string;
  prize_type: number;
  start_date: string;
  end_date: string;
  first_place_amount: string;
  second_place_amount: string;
  third_place_amount: string;
  problem_statement: string;
  skills_required: [];
};

type MyBountiesResponse = {
  total_bounties: number;
  bounties: Bounty[];
};

const Page = () => {
  const { accessToken } = useAuth();
  const { address } = useXionWallet();
  const { isNewClientUser } = useAuthContext();
  const router = useRouter();

  const [selectedBounty, setSelectedBounty] = useState<Bounty | null>(null);
  useEffect(() => {
    const fetchClientProfile = async () => {
      if (!address) {
        return;
      }

      const { data: client_profiles, error } = await supabase
        .from('client_profiles')
        .select('*')
        .eq('wallet_address', address);

      if (error) {
        console.error('Error fetching freelancer profile:', error);
      } else {
        console.log('Client profile:', client_profiles);
      }
      return client_profiles;
    };

    const client_profile = fetchClientProfile();

    client_profile.then((res) => {
      if (res) {
        router.push(ApplicationRoutes.CLIENT_BOUNTY);
      }
      if (!res && isNewClientUser) {
        router.push(ApplicationRoutes.CLIENT_SETUP_ONBOARDING);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNewClientUser, router]);

  const fetchMyBounties = async () => {
    try {
      const response = await fetch(
        `https://x-works-be.onrender.com/api/my-bounty/`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch bounties: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  };

  const { data: myBounties } = useQuery<MyBountiesResponse>({
    queryKey: ['my-bounties'],
    queryFn: fetchMyBounties,
  });

  return (
    <>
      {selectedBounty && (
        <BountyDetailModal
          bounty={selectedBounty}
          onClose={() => setSelectedBounty(null)}
        />
      )}
      <div>
        <div className="flex justify-between items-end">
          <div className="">
            <h2 className="text-[40px] font-semibold tracking-[-2px] leading-[40px]">
              My Bounties
            </h2>
            <p className="text-[14px] font-medium text-[#7E8082]">
              You&apos;ve created {myBounties?.total_bounties} bount
              {myBounties && myBounties?.total_bounties > 1 ? 'ies' : 'y'} so
              far.
            </p>
          </div>
          <Link href="bounty/createBounty">
            <div className="bg-[#1A73E8]  h-[45px] w-[150px] font-semibold rounded-[8px] text-white text-[14px] grid place-items-center">
              Create New Bounty
            </div>
          </Link>
        </div>
        <div className="bg-white w-full rounded-[8px] py-[20px] mt-[20px]">
          <h3 className="text-[16px] text-[#18181B] font-semibold mx-[20px]">
            Bounties
          </h3>
          {/* <div className="flex justify-between mt-[20px] px-[20px]">
            <div className="border-[1px] border-[#E4E4E7] rounded-[12px] h-[36px] w-[320px] flex items-center">
              <div className="w-[36px] h-full grid place-items-center">
                <IoIosSearch className="text-[#868FA0] text-[18px]" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="h-full flex-1 outline-none rounded-r-[12px]"
              />
            </div>
            <div className="flex items-center gap-[20px]">
              <div className="h-[36px] px-[10px] border-[#E4E4E7] border-[1px] rounded-[12px] items-center flex justify-center text-[14px] text-[#545756] min-w-[88px]">
                <select name="" id="" className="w-full outline-none">
                  <option value="">Status</option>
                </select>
              </div>
              <div className="h-[36px] px-[10px] border-[#E4E4E7] border-[1px] rounded-[12px] items-center flex justify-center text-[14px] text-[#545756] min-w-[88px]">
                <select name="" id="" className="w-full outline-none">
                  <option value="">Date</option>
                </select>
              </div>
              <div className="h-[36px] px-[10px] border-[#E4E4E7] border-[1px] rounded-[12px] items-center flex justify-center text-[14px] text-[#545756] min-w-[88px]">
                <select name="" id="" className="w-full outline-none">
                  <option value="">Project</option>
                </select>
              </div>
            </div>
          </div> */}

          {/* Table Format */}
          <div className="px-[20px] mt-[15px]">
            <TableContainer
              component={Paper}
              sx={{ borderRadius: '12px', boxShadow: 'none' }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#F4F4F5' }}>
                    <TableCell sx={{ fontWeight: 600, borderBottom: 'none' }}>
                      Bounty Title
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, borderBottom: 'none' }}>
                      Status
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, borderBottom: 'none' }}>
                      Category
                    </TableCell>
                    {/* <TableCell sx={{ fontWeight: 600, borderBottom: 'none' }}>
                      Submissions
                    </TableCell> */}
                    <TableCell sx={{ fontWeight: 600, borderBottom: 'none' }}>
                      Start Date
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, borderBottom: 'none' }}>
                      End Date
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {myBounties?.bounties?.map((row, index) => (
                    <TableRow
                      key={index}
                      onClick={() => setSelectedBounty(row)}
                      sx={{
                        cursor: 'pointer',
                        '& tr:first-of-type td': {
                          borderTop: 'none',
                        },
                        '&:not(:last-child) td, &:not(:last-child) th': {
                          borderBottom: '1px solid #F4F4F5',
                        },

                        '&:last-child td, &:last-child th': {
                          borderBottom: 'none',
                        },
                        color: '#545756',
                      }}
                    >
                      <TableCell>{row.title}</TableCell>
                      <TableCell>
                        <Chip
                          label={row.status}
                          variant="outlined"
                          size="small"
                          sx={{
                            fontWeight: 500,
                            borderRadius: '12px',
                            border: 'none',
                            paddingY: '4px',
                            paddingX: '8px',
                            fontSize: '12px',
                            backgroundColor:
                              row.status === 'Open'
                                ? '#22C55E0D'
                                : row.status === 'Judging'
                                  ? '#EAB3080D'
                                  : row.status === 'Scheduled'
                                    ? '#8B5CF60D'
                                    : row.status === 'Closed'
                                      ? '#FEE2E2'
                                      : row.status === 'In Progress'
                                        ? '#DCFCE7'
                                        : 'transparent',
                            color:
                              row.status === 'Open'
                                ? '#22C55E'
                                : row.status === 'Judging'
                                  ? '#EAB308'
                                  : row.status === 'Scheduled'
                                    ? '#8B5CF6'
                                    : row.status === 'Closed'
                                      ? '#EF4444'
                                      : row.status === 'In Progress'
                                        ? '#16A34A'
                                        : 'inherit',
                          }}
                        />
                      </TableCell>
                      <TableCell>{row.category}</TableCell>
                      {/* <TableCell>{row.submissions}</TableCell> */}
                      <TableCell>{row.start_date}</TableCell>
                      <TableCell>{row.end_date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          {/* <div className="flex text-[#18181B] px-[20px] justify-between items-center font-medium text-[14px] pt-[12px] pb-[16px] mt-[10px] border-t-[#ECECEC] border-t-[1px]">
            <div className="border-[#D5D7DA] border-[1px] h-[36px] w-[107px] rounded-[8px] flex items-center justify-center gap-[5px]">
              <FaArrowLeft />
              Previous
            </div>
            <div>
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;

                // Show first 2, last 2, current, and neighbors
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === page
                          ? 'bg-[#F4F5FA] text-[#1A73E8] font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  );
                }

                // Ellipsis
                if (
                  (page === currentPage - 2 && currentPage > 3) ||
                  (page === currentPage + 2 && currentPage < totalPages - 2)
                ) {
                  return (
                    <span key={page} className="px-2">
                      …
                    </span>
                  );
                }

                return null;
              })}
            </div>
            <div className="border-[#D5D7DA] border-[1px] h-[36px] w-[107px] rounded-[8px] flex items-center justify-center gap-[5px]">
              Next
              <FaArrowRight />
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default Page;
