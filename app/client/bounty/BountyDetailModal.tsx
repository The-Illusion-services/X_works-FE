'use client';
import React, { useState } from 'react';
import { HiOutlineArrowNarrowLeft } from 'react-icons/hi';
import { SlOptionsVertical } from 'react-icons/sl';
import Submission from './Submission';
import SelectedWinners from './SelectedWinners';

const BountyDetailModal = () => {
  const BountyDetails = {
    title: 'Design a Clean, Mobile-Friendly Crypto Wallet Dashboard UI',
    category: 'Design',
    date: 'June 20, 2025',
    status: 'Open',
    submissions: 10,
    winners: 0,
    totalPrizes: 5000,
    description: {
      problemStatement:
        'Wallet fragmentation makes it hard for builders, merchants and consumerusers using Solana Pay to know which wallets actually deliver a solid Solana Pay checkout. We need a living reference that catalogues every wallet with Solana support, details their key features, and clearly flags Solana Pay QR-code compatibility.',
      whatYoullBuild: {
        walletInventory:
          'Include every mobile, browser-extension, and desktop wallet that currently supports Solana mainnet (even niche or regional wallets).',
        featureMatrix: [
          'Platforms (iOS, Android, Chrome, etc.)',
          'Custody model (self-custody, MPC, custodial)',
          'In-app DEX swap',
          'NFT gallery',
          'In-app staking',
          'Fiat on-ramp / Fiat off-ramps',
          'Push-notification support',
          'Solana Pay QR reader – Yes / Partial / No (critical)',
          'Version or build number tested and the date of testing',
        ],
        outputFormat: [
          'Interactive dashboard (Simple web app, Airtable, Notion DB, etc.) with filters and export option',
          'One-page snapshot (high-resolution infographic + PDF report, max 5 pages)',
        ],
        reUsability:
          'Provide raw source data (CSV or JSON) and brief instructions for future updates.',
        designPolish:
          'Prioritise clarity. Use consistent icons, colour-codes, and typography; attribute wallet logos correctly.',
      },
      deliverables: [
        'High-fidelity design in Figma',
        'Link to live prototype (optional)',
        'Brief documentation on the design choices',
      ],
    },
    prize: {
      total: 5000,
      breakdown: {
        first: 2000,
        second: 1000,
        third: 500,
        fourth: 500,
      },
    },
    skills: ['Web Design', 'UI/UX Design', 'Prototyping'],
    timeline: {
      startDate: 'Apr 14, 2025',
      submission: 'Apr 14, 2025',
      winnerAnnouncement: 'Apr 14, 2025',
    },
  };

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

  return (
    <div className="bg-muted fixed top-[90px] left-0 h-[calc(100vh-90px)] w-screen">
      <div className="px-[20px] w-full 2xl:w-[1500px] md:px-10 xl:px-36 bg-muted overflow-hidden h-full">
        <div className="overflow-y-auto h-full py-[30px]">
          {/* "Go back" buttons and desc */}
          <div className="flex items-center text-[14px] gap-[15px]">
            <div className="flex items-center gap-[8px]">
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
            <div className="bg-[#3B82F60D] text-[#3B82F6] font-semibold px-[8px] py-[4px] rounded-[12px] w-max text-[12px]">
              Open
            </div>
            <div className="">
              <header className="">
                <div className="flex justify-between my-[10px] items-center">
                  <div className="flex flex-col">
                    <h1 className="text-[#18181B] text-[18px] font-semibold">
                      {BountyDetails.title}
                    </h1>
                    <p className="text-[#7E8082] text-[14px]">
                      {BountyDetails.category} • {BountyDetails.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-[12px]">
                    <div className="flex items-center border-[1px] rounded-[4px] border-[#E4E4E7] text-[14px] px-[8px] py-[7px] gap-[3px]">
                      <div className="bg-[#3B82F6] h-[6px] w-[6px] rounded-full"></div>{' '}
                      <select name="" id="" className="outline-none">
                        <option value="">Open</option>
                      </select>
                    </div>
                    <div className="text-[#3D3D3D] text-[13px]">
                      <SlOptionsVertical />
                    </div>
                  </div>
                </div>
                <div className="gap-[20px] my-[30px] flex items-center">
                  <div className="p-[16px] border-[#E4E4E7] border-[1px] flex-1 rounded-[14px] flex flex-col items-center">
                    <span className="text-[24px] text-[#101928] font-semibold">
                      {BountyDetails.submissions}
                    </span>
                    <span>Submissions</span>
                  </div>
                  <div className="p-[16px] border-[#E4E4E7] border-[1px] flex-1 rounded-[14px] flex flex-col items-center">
                    <span className="text-[24px] text-[#101928] font-semibold">
                      {BountyDetails.winners}
                    </span>
                    <span>Winners</span>
                  </div>
                  <div className="p-[16px] border-[#E4E4E7] border-[1px] flex-1 rounded-[14px] flex flex-col items-center">
                    <span className="text-[24px] text-[#101928] font-semibold">
                      ${BountyDetails.totalPrizes}
                    </span>
                    <span>Total Prizes</span>
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
                      {BountyDetails.description.problemStatement}
                    </p>

                    <h3 className="text-[18px] text-[#545756] font-semibold mb-[10px]">
                      What You&apos;ll Build
                    </h3>

                    <h4 className="text-[16px] text-[#545756] font-semibold mb-[10px]">
                      1. Wallet Inventory
                    </h4>
                    <p className="text-[#7E8082] mb-[20px]">
                      {BountyDetails.description.whatYoullBuild.walletInventory}
                    </p>

                    <h4 className="text-[16px] text-[#545756] font-semibold mb-[10px]">
                      2. Feature Matrix
                    </h4>
                    <ul className="list-disc pl-[20px] text-[#7E8082] mb-[20px]">
                      {BountyDetails.description.whatYoullBuild.featureMatrix.map(
                        (feature, i) => (
                          <li key={i}>{feature}</li>
                        ),
                      )}
                    </ul>

                    <h4 className="text-[16px] text-[#545756] font-semibold mb-[10px]">
                      3. Output Format (choose one):
                    </h4>
                    <ul className="list-disc pl-[20px] text-[#7E8082] mb-[20px]">
                      {BountyDetails.description.whatYoullBuild.outputFormat.map(
                        (format, i) => (
                          <li key={i}>{format}</li>
                        ),
                      )}
                    </ul>

                    <h4 className="text-[16px] text-[#545756] font-semibold mb-[10px]">
                      4. Re-usability
                    </h4>
                    <ul className="list-disc pl-[20px] text-[#7E8082] mb-[20px]">
                      <li className="text-[#7E8082]">
                        {BountyDetails.description.whatYoullBuild.reUsability}
                      </li>
                    </ul>

                    <h4 className="text-[16px] text-[#545756] font-semibold mb-[10px]">
                      5. Design Polish
                    </h4>
                    <ul className="list-disc pl-[20px] text-[#7E8082] mb-[20px]">
                      <li className="text-[#7E8082]">
                        {BountyDetails.description.whatYoullBuild.designPolish}
                      </li>
                    </ul>

                    <h3 className="text-[18px] text-[#545756] font-semibold mb-[10px]">
                      Deliverables
                    </h3>
                    <ul className="list-disc pl-[20px] text-[#7E8082] mb-[20px]">
                      {BountyDetails.description.deliverables.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </section>

                  <section className="border-y-[1px] border-y-[#E4E4E7] py-[20px]">
                    <h2 className="text-[20px] mb-[5px] font-bold">Prize</h2>
                    <div className="flex items-center gap-[50px]">
                      <div className="flex flex-col">
                        <p className="text-[40px] font-extrabold leading-[40px]">
                          ${BountyDetails.prize.total}
                        </p>
                        <p className="text-[14px] text-[#545756]">
                          Total Prizes
                        </p>
                      </div>
                      <ul className="text-[#545756] flex flex-col gap-y-[8px]">
                        <li>
                          1st Place: ${BountyDetails.prize.breakdown.first}
                        </li>
                        <li>
                          2nd Place: ${BountyDetails.prize.breakdown.second}
                        </li>
                        <li>
                          3rd Place: ${BountyDetails.prize.breakdown.third}
                        </li>
                        <li>
                          4th Place: ${BountyDetails.prize.breakdown.fourth}
                        </li>
                      </ul>
                    </div>
                  </section>

                  <section className="border-b-[1px] border-b-[#E4E4E7] py-[20px]">
                    <h2 className="text-[20px] mb-[5px] font-bold">Skills</h2>
                    <div className="flex mt-[20px] gap-[10px]">
                      {BountyDetails.skills.map((tag, i) => {
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
                      {BountyDetails.timeline.startDate}
                    </p>
                    <p className="flex flex-col text-[#7E8082] mb-[10px]">
                      <strong className="text-[#545756] text-[18px]">
                        Submission:
                      </strong>{' '}
                      {BountyDetails.timeline.submission}
                    </p>
                    <p className="flex flex-col text-[#7E8082] mb-[10px]">
                      <strong className="text-[#545756] text-[18px]">
                        Winner Announcement Date:
                      </strong>{' '}
                      {BountyDetails.timeline.winnerAnnouncement}
                    </p>
                  </section>
                </div>
              ) : navTab.submission ? (
                <Submission />
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
