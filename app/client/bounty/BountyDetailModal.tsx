'use client';
import React, { useState } from 'react';
import { HiOutlineArrowNarrowLeft } from 'react-icons/hi';
import Submission from './Submission';
import SelectedWinners from './SelectedWinners';
import { useAuth } from '@/hooks/useAuth';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

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

type BountyDetailModalProps = {
  bounty: Bounty; // this prop must match your Bounty type
  onClose: () => void;
};

const BountyDetailModal = ({ bounty, onClose }: BountyDetailModalProps) => {
  const router = useRouter();
  const { accessToken } = useAuth();
  const bountyId = bounty?.id;
  const QueryClient = useQueryClient();
  type TabType = 'DESCRIPTION' | 'SUBMISSION' | 'SELECTED_WINNERS';

  interface NavTabState {
    description: boolean;
    submission: boolean;
    selectedWinners: boolean;
  }

  const [navTab, setNavTab] = useState<NavTabState>({
    description: true,
    submission: false,
    selectedWinners: false,
  });

  const handleActiveTab = (type: TabType) => {
    switch (type) {
      case 'DESCRIPTION':
        setNavTab({
          ...navTab,
          description: true,
          submission: false,
          selectedWinners: false,
        });
        break;

      case 'SUBMISSION':
        setNavTab({
          ...navTab,
          description: false,
          submission: true,
          selectedWinners: false,
        });
        break;

      case 'SELECTED_WINNERS':
        setNavTab({
          ...navTab,
          description: false,
          submission: false,
          selectedWinners: true,
        });
        break;

      default:
        setNavTab({ ...navTab });
    }
  };

  const totalPrize =
    (parseFloat(bounty.first_place_amount) || 0) +
    (parseFloat(bounty.second_place_amount) || 0) +
    (parseFloat(bounty.third_place_amount) || 0);

  const fetchBountySubmissions = async () => {
    try {
      const response = await fetch(
        `https://x-works-be.onrender.com/api/bounty/${bountyId}/submissions/`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch bounty submissions: ${response.statusText}`,
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  };

  const { data: bountySubmissions } = useQuery({
    queryKey: ['bounty-details'],
    queryFn: fetchBountySubmissions,
    enabled: !!bountyId,
  });

  const handleDeleteBounty = async () => {
    try {
      const response = await fetch(
        `https://x-works-be.onrender.com/api/bounty/${bountyId}/`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to delete bounty: ${response.statusText}`);
      }

      const data = await response.json();
      QueryClient.invalidateQueries({ queryKey: ['my-bounties'] });
      router.push('/client/bounty');
      return data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  };

  return (
    <div className="bg-muted fixed top-[90px] left-0 h-[calc(100vh-90px)] w-screen">
      <div className="px-[20px] w-full 2xl:w-[1500px] md:px-10 xl:px-36 bg-muted overflow-hidden h-full">
        <div className="overflow-y-auto h-full py-[30px]">
          {/* "Go back" buttons and desc */}
          <div className="flex items-center text-[14px] gap-[15px]">
            <div
              className="flex items-center gap-[8px] cursor-pointer"
              onClick={onClose}
            >
              <div className="bg-white border-[1px] h-[24px] w-[24px] rounded-[4px] border-[#E4E7EC] grid place-items-center">
                <HiOutlineArrowNarrowLeft className="text-[12px]" />
              </div>
              <p className="font-semibold">Go Back</p>
            </div>
            <div className="flex gap-[5px]">
              <p className="text-[#7E8082] ">Projects / </p>{' '}
              <p className="text-[#1A73E8] font-medium"> Web Designer - UIUX</p>
            </div>
          </div>
          {/* White Part */}
          <div className="bg-white w-full rounded-[8px] p-[20px] mt-[20px]">
            <div className="bg-[#3B82F60D] text-[#3B82F6] font-semibold px-[8px] py-[4px] rounded-[12px] w-max text-[12px] capitalize">
              {bounty.status}
            </div>
            <div className="">
              <header className="">
                <div className="flex justify-between my-[10px] items-center">
                  <div className="flex flex-col">
                    <h1 className="text-[#18181B] text-[18px] font-semibold">
                      {bounty.title}
                    </h1>
                    <p className="text-[#7E8082] text-[14px]">
                      {bounty.category} • {bounty.start_date}
                    </p>
                  </div>
                  <div className="flex items-center gap-[12px]">
                    <button
                      className="bg-red-500 text-[14px] px-3 py-2 rounded-[8px] text-white cursor-pointer"
                      onClick={() => handleDeleteBounty()}
                    >
                      Delete Bounty
                    </button>
                  </div>
                </div>
                <div className="gap-[20px] my-[30px] flex items-center">
                  {/* <div className="p-[16px] border-[#E4E4E7] border-[1px] flex-1 rounded-[14px] flex flex-col items-center">
                    <span className="text-[24px] text-[#101928] font-semibold">
                      {bounty.submissions}
                    </span>
                    <span>Submissions</span>
                  </div>
                  <div className="p-[16px] border-[#E4E4E7] border-[1px] flex-1 rounded-[14px] flex flex-col items-center">
                    <span className="text-[24px] text-[#101928] font-semibold">
                      {bounty.winners}
                    </span>
                    <span>Winners</span>
                  </div> */}
                  <div className="p-[16px] border-[#E4E4E7] border-[1px] flex-1 rounded-[14px] flex flex-col items-center">
                    <span className="text-[24px] text-[#101928] font-semibold">
                      ${totalPrize}
                    </span>
                    <span>Prizes</span>
                  </div>
                </div>
              </header>

              <div className="bg-[#F9F9F9] rounded-[38px] h-[40px] w-[450px] text-[14px] font-semibold flex items-center relative">
                <div
                  className={`flex-1 flex justify-center cursor-pointer relative z-10`}
                  onClick={() => handleActiveTab('DESCRIPTION')}
                >
                  Description
                </div>
                <div
                  className={`flex-1 flex justify-center cursor-pointer relative z-10`}
                  onClick={() => handleActiveTab('SUBMISSION')}
                >
                  Submission
                </div>
                <div
                  className={`flex-1 flex justify-center cursor-pointer relative z-10`}
                  onClick={() => handleActiveTab('SELECTED_WINNERS')}
                >
                  Selected Winners
                </div>
                <div
                  className={`absolute h-full w-[150px] bg-transparent transition-all rounded-[32px] ${
                    navTab.description
                      ? 'translate-x-0'
                      : navTab.submission
                        ? 'translate-x-[150px]'
                        : 'translate-x-[300px]'
                  } z-[0] p-[5px]`}
                >
                  <div className="bg-white h-full w-full rounded-[32px]"></div>
                </div>
              </div>

              {navTab.description ? (
                <div>
                  <section className="mt-[20px]">
                    <h2 className="text-[20px] mb-[20px] font-semibold">
                      Description
                    </h2>

                    <h3 className="text-[18px] text-[#545756] font-semibold mb-[5px]">
                      Problem Statement
                    </h3>
                    <p className="text-[#7E8082] mb-[20px]">
                      {bounty.problem_statement}
                    </p>
                  </section>

                  <section className="border-y-[1px] border-y-[#E4E4E7] py-[20px]">
                    <h2 className="text-[20px] mb-[5px] font-bold">Prize</h2>
                    <div className="flex items-center gap-[50px]">
                      <div className="flex flex-col">
                        <p className="text-[40px] font-extrabold leading-[40px]">
                          ${totalPrize}
                        </p>
                        <p className="text-[14px] text-[#545756]">
                          Total Prizes
                        </p>
                      </div>
                      <ul className="text-[#545756] flex flex-col gap-y-[8px]">
                        <li>1st Place: ${bounty.first_place_amount}</li>
                        <li>2nd Place: ${bounty.second_place_amount}</li>
                        <li>3rd Place: ${bounty.third_place_amount}</li>
                      </ul>
                    </div>
                  </section>

                  <section className="border-b-[1px] border-b-[#E4E4E7] py-[20px]">
                    <h2 className="text-[20px] mb-[5px] font-bold">Skills</h2>
                    <div className="flex mt-[20px] gap-[10px]">
                      {bounty.skills_required.map((tag, i) => {
                        return (
                          <div
                            className="bg-[#F4F4F5] h-[34px] rounded-full text-[14px] text-[#545756] px-[16px] py-[8px] group-hover:bg-white transition-all border-[1px] border-[#E4E4E7]"
                            key={i}
                          >
                            {tag}
                          </div>
                        );
                      })}
                    </div>
                  </section>

                  <section className="pt-[20px]">
                    <h2 className="text-[20px] text-[#18181B] font-bold mb-[15px]">
                      Timeline
                    </h2>
                    <p className="flex flex-col text-[#7E8082] mb-[10px]">
                      <strong className="text-[#545756] text-[18px]">
                        Start Date
                      </strong>{' '}
                      {bounty.start_date}
                    </p>
                    <p className="flex flex-col text-[#7E8082] mb-[10px]">
                      <strong className="text-[#545756] text-[18px]">
                        Submission:
                      </strong>{' '}
                      {bounty.end_date}
                    </p>
                  </section>
                </div>
              ) : navTab.submission ? (
                <Submission
                  submissions={bountySubmissions?.submissions || []}
                  bountyId={bounty.id}
                />
              ) : navTab.selectedWinners ? (
                <SelectedWinners />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BountyDetailModal;
