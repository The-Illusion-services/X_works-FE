'use client';
import React, { useState } from 'react';
import {
  Search,
  Filter,
  Clock,
  DollarSign,
  Users,
  Trophy,
  X,
  ExternalLink,
  Twitter,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const BountyPlatform = () => {
  const [selectedBounty, setSelectedBounty] = useState(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const { accessToken } = useAuth();

  const tabs = ['All', 'UI/UX', 'Content', 'Graphic', 'Development', 'Others'];

  const initialValues = {
    application_text: '',
  };

  const validationSchema = Yup.object({
    application_text: Yup.string()
      .required('Application text is required')
      .min(1, 'Must be at least 1 character')
      .max(1000, 'Cannot exceed 1000 characters'),
  });

  const leaderboard = [
    {
      rank: 1,
      name: 'Folake Malik',
      wallet: '0xc57A...A578',
      wins: 10,
      earned: '100k XION',
    },
    {
      rank: 2,
      name: 'Aisha Kafilat',
      wallet: '0xc57A...A578',
      wins: 8,
      earned: '10k XION',
    },
    {
      rank: 3,
      name: 'Efe Wale',
      wallet: '0xc57A...A578',
      wins: 6,
      earned: '10k XION',
    },
    {
      rank: 4,
      name: 'Eniola Sekou',
      wallet: '0xc57A...A578',
      wins: 4,
      earned: '10k XION',
    },
    {
      rank: 5,
      name: 'Chidinma Omolara',
      wallet: '0xc57A...A578',
      wins: 2,
      earned: '10k XION',
    },
  ];

  console.log('selected Bounty: ', selectedBounty);

  const fetchBounties = async () => {
    try {
      const response = await fetch(
        `https://x-works-be.onrender.com/api/get-bounty/`,
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
          `Failed to fetch dashboard graph data: ${response.statusText}`,
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  };

  const { data: bounties } = useQuery({
    queryKey: ['bounties'],
    queryFn: fetchBounties,
  });

  const handleSubmit = async (values) => {
    try {
      const res = await fetch(
        `https://x-works-be.onrender.com/api/bounty/${selectedBounty}/apply/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        },
      );

      if (!res.ok) {
        throw new Error('Failed to submit application');
      }

      const data = await res.json();
      console.log('Application submitted successfully:', data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchBountyDetails = async () => {
    try {
      const response = await fetch(
        `https://x-works-be.onrender.com/api/get-bounty/${selectedBounty}/`,
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
          `Failed to fetch dashboard graph data: ${response.statusText}`,
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  };

  const { data: bountyDetails } = useQuery({
    queryKey: ['bounty-details'],
    queryFn: fetchBountyDetails,
    enabled: !!selectedBounty,
  });

  const detailedBounty = {
    id: 1,
    title: 'Design a Clean, Mobile-Friendly Crypto Wallet Dashboard UI',
    company: 'Illusion Services',
    location: 'Canada',
    totalPrize: 5000,
    prizes: {
      first: 2000,
      second: 1000,
      third: 500,
      fourth: 500,
    },
    timeLeft: { days: 4, hours: 24, minutes: 4 },
    winnersDate: 'July 22, 2025',
    skills: ['Web Design', 'UI/UX Design', 'Prototyping'],
    problem:
      'Wallet fragmentation makes it hard for builders, merchants and consumers using Solana Pay to know which wallets actually deliver a solid Solana Pay checkout. We need a living reference that catalogues every wallet with Solana support, details their key features, and clearly flags Solana Pay QR-code compatibility.',
    requirements: {
      walletInventory: [
        'Include every mobile, browser-extension, and desktop wallet that currently supports Solana mainnet (even niche or regional wallets).',
      ],
      featureMatrix: [
        'Platforms (iOS, Android, Chrome, etc.)',
        'Custody model (self-custody, MPC, custodial)',
        'In-app DEX swap',
        'NFT gallery',
        'In-app staking',
        'Fiat on-ramp / Fiat off-ramps',
        'Push notification support',
        'Solana Pay QR reader - Yes / Partial / No (critical)',
        'Version or build number tested and the date of testing',
        '(Feel free to add more features you find useful.)',
      ],
      outputFormat: [
        'Interactive dashboard (Simple web app, Airtable, Notion DB, etc.) with filters and export option, or',
        'One-page snapshot (High-resolution infographic + PDF report, max 5 pages) suitable for adding to pitch decks.',
      ],
      reUsability: [
        'Provide raw source data (CSV or JSON) and brief instructions for future updates.',
      ],
      designPolish: [
        'Prioritise clarity. Use consistent icons, colour-codes, and typography; attribute wallet logos correctly',
      ],
    },
    deliverables: [
      'High-fidelity design in Figma',
      'Link to live prototype (optional)',
      'Brief documentation on the design choices',
    ],
  };

  const BountyCard = ({ bounty, onClick }) => {
    let skills = [];
    try {
      if (Array.isArray(bounty?.skills_required)) {
        skills = bounty.skills_required;
      } else if (typeof bounty?.skills_required === 'string') {
        if (bounty.skills_required.trim().startsWith('[')) {
          // It's a JSON stringified array: '["Creative writing", "Design"]'
          skills = JSON.parse(bounty.skills_required);
        } else {
          // It's just a plain string: "Creative writing"
          skills = [bounty.skills_required];
        }
      }
    } catch (err) {
      console.error(
        'Failed to parse skills_required:',
        bounty.skills_required,
        err,
      );
      skills = [];
    }
    return (
      <div
        className="bg-white rounded-lg p-[16px] transition-all hover:bg-[#F4F4F5] cursor-pointer h-[164px] group"
        onClick={() => onClick(bounty)}
      >
        <div className="flex items-start gap-4">
          <div className="flex-1">
            <div className="flex gap-[10px] mb-[20px]">
              <div className="h-[50px] w-[50px] group-hover:bg-white bg-gray-100 flex items-center justify-center rounded-[8px]">
                {/* {bounty.logo} */}
              </div>
              <div className="flex flex-col">
                <h3 className="font-semibold text-[#18181B] text-[18px]">
                  {bounty.title}
                </h3>
                <p className="text-sm text-[#7E8082]">{bounty.category}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {skills.map((tag, i) => {
                return (
                  <div
                    className="bg-[#F4F4F5] h-[32px] rounded-full text-[12px] text-[#545756] px-[16px] py-[8px] group-hover:bg-white transition-all"
                    key={i}
                  >
                    {tag}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-[30px] items-center mt-[20px]">
              <div className="text-[#545756] text-[14px]">
                <span className="text-[#7E8082] mr-[5px]">Prize type:</span>
                {bounty.prize_type}
              </div>
              <div className="text-[#545756] text-[14px]">
                <span className="text-[#7E8082] mr-[5px]">Status:</span>
                {bounty.status}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const LeaderboardCard = () => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Leaderboard</h3>
        <button className="text-blue-600 text-sm hover:text-blue-700">
          See all
        </button>
      </div>

      <div className="space-y-3">
        {leaderboard.map((user) => (
          <div key={user.rank} className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500 w-6">
              #{user.rank}
            </span>
            <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {user.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.wallet}</p>
            </div>
            <div className="text-right">
              <p className="font-medium text-gray-900 text-sm">{user.wins}</p>
              <p className="text-xs text-gray-500">{user.earned}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const SubmissionModal = ({ onClose, selectedBounty }) => (
    <div className="fixed inset-0 backdrop-blur-[7px] bg-[#0D1012B2] flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Apply for bounty
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Text
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Include any details, context, or links you think are relevant.
                </p>
                <Field
                  as="textarea"
                  name="application_text"
                  placeholder="Enter text here"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <ErrorMessage
                  name="application_text"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Applying...' : 'Apply'}
              </button>
            </Form>
          )}
        </Formik>

        <p className="text-xs text-gray-500 text-center mt-3">
          By applying to this bounty, you agree to our Terms of Use.
        </p>
      </div>
    </div>
  );

  const BountyDetail = ({ bounty, onClose, onSubmit }) => (
    <div className="fixed top-[90px] inset-0 bg-gray-50 z-40 overflow-y-auto">
      <div className="max-w-6xl mx-auto p-6">
        <button
          onClick={onClose}
          className="mb-4 text-gray-600 hover:text-gray-800 flex items-center gap-2"
        >
          ← Back to bounties
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-start gap-4 mb-6">
                <div className="text-3xl">🟣</div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {bountyDetails?.title}
                  </h1>
                  <p className="text-gray-600 capitalize">
                    {bountyDetails?.status}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Problem Statement
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {bountyDetails?.problem_statement}
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              {bountyDetails?.single_prize_amount ? (
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-gray-900">
                    ${bountyDetails?.single_prize_amount?.toLocaleString()}
                  </div>
                  <div className="text-gray-600">Total Prizes</div>
                </div>
              ) : (
                <div className="text-3xl font-bold text-gray-900 text-center mb-[20px]">
                  Prizes Breakdown
                </div>
              )}

              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">1st Place:</span>
                  <span className="font-medium">
                    ${bountyDetails?.first_place_amount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">2nd Place:</span>
                  <span className="font-medium">
                    ${bountyDetails?.second_place_amount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">3rd Place:</span>
                  <span className="font-medium">
                    ${bountyDetails?.third_place_amount}
                  </span>
                </div>
              </div>

              <div className="text-center mb-6">
                <div className="text-sm text-gray-600">
                  Winners Announced on:
                </div>
                <div className="font-medium text-gray-900">
                  {bountyDetails?.end_date}
                </div>
              </div>

              <button
                onClick={onSubmit}
                className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 transition-colors mb-4"
              >
                Apply to Bounty
              </button>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-6">
                <Users size={16} />
                <span>2x+ Submission</span>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {bounty.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (selectedBounty) {
    return (
      <>
        <BountyDetail
          bounty={detailedBounty}
          onClose={() => setSelectedBounty(null)}
          onSubmit={() => setShowSubmissionModal(true)}
        />
        {showSubmissionModal && (
          <SubmissionModal onClose={() => setShowSubmissionModal(false)} />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-[#1A73E8] flex p-[20px] items-center h-[139px] rounded-[14px] text-white">
        <div className="max-w-6xl p-6">
          <h1 className="text-3xl font-bold mb-2">Explore Bounties</h1>
          <p className="text-blue-100">
            Browse open bounties, complete tasks, and get paid directly to your
            wallet.
          </p>
        </div>
      </div>

      <div className="rounded-[14px] bg-white mt-[30px] p-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex gap-[10px]">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium transition-colors rounded-[31px] ${
                  activeTab === tab
                    ? 'bg-[#1A73E8] text-white'
                    : 'text-[#545756] border-[#E4E4E7] border-[1px]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search bounties..."
                className="pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
              <Filter size={16} />
              Filter
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="">
              {bounties?.map((bounty) => (
                <BountyCard
                  key={bounty.id}
                  bounty={bounty}
                  onClick={() => setSelectedBounty(bounty.id)}
                />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <LeaderboardCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BountyPlatform;
