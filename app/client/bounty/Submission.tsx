'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import { IoIosSearch } from 'react-icons/io';
import SubmissionDetail from './SubmissionDetails';

type Submission = {
  id: string;
  name: string;
  application_text: string;
  applied_at: string;
  wallet: string;
  image?: string;
};

type SubmissionWithBounty = Submission & {
  bountyId: string;
  status?: 'pending' | 'winner' | 'disqualified';
};

type SubmissionProps = {
  submissions?: Submission[];
  bountyId: string;
};

const getInitials = (name: string) => {
  const parts = name.split(' ');
  return parts.length > 1
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : parts[0][0].toUpperCase();
};

const UserCard: React.FC<{ user: Submission }> = ({ user }) => {
  return (
    <div className="flex cursor-pointer items-center gap-4 p-4 border-[1px] border-[#E4E4E7] rounded-[14px]">
      {user.image ? (
        <Image
          src={user.image}
          alt={user.name}
          width={20}
          height={20}
          className="w-14 h-14 rounded-full object-cover"
        />
      ) : (
        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-purple-500 text-white font-semibold">
          {getInitials(user.name)}
        </div>
      )}
      <div>
        <h2 className="font-semibold leading-[20px] text-[#18181B]">
          {user.name}
        </h2>
        <p className="text-[14px] text-[#7E8082]">{user.application_text}</p>
        <p className="text-[14px] text-[#7E8082]">
          {new Date(user.applied_at).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

const Submission: React.FC<SubmissionProps> = ({ submissions, bountyId }) => {
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<SubmissionWithBounty | null>(
    null,
  );

  const filteredUsers = submissions
    ?.map((s) => ({ ...s, bountyId, status: 'pending' as const }))
    .filter((submission) =>
      submission.name.toLowerCase().includes(search.toLowerCase()),
    );

  const handleMarkAsWinner = (userId: string) => {
    console.log('Marked as winner:', userId);
    // You can add additional logic here if needed
  };

  const handleDisqualify = (userId: string) => {
    console.log('Disqualified:', userId);
    // You can add additional logic here if needed
  };

  const handleAddToWinnersList = (userId: string) => {
    console.log('Added to winners list:', userId);
    // You can add additional logic here if needed
  };

  return (
    <div className="p-6">
      {/* Submission Detail Modal */}
      {selectedUser && (
        <SubmissionDetail
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onMarkAsWinner={handleMarkAsWinner}
          onDisqualify={handleDisqualify}
          onAddToWinnersList={handleAddToWinnersList}
        />
      )}

      {/* Top Controls */}
      <div className="flex items-center justify-between mb-6">
        {/* Search */}
        <div className="border-[1px] border-[#E4E4E7] rounded-[12px] h-[36px] w-[320px] flex items-center">
          <div className="w-[36px] h-full grid place-items-center">
            <IoIosSearch className="text-[#868FA0] text-[18px]" />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="h-full flex-1 outline-none rounded-r-[12px]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <div className="border-[#E4E4E7] rounded-[12px] px-[8px] text-[14px] border-[1px] h-[36px] w-[88px]">
            <select className="rounded-lg w-full h-full outline-none">
              <option>Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
          <div className="border-[#E4E4E7] rounded-[12px] px-[8px] text-[14px] border-[1px] h-[36px] w-[78px]">
            <select className="rounded-lg w-full h-full outline-none">
              <option>Date</option>
              <option>Newest</option>
              <option>Oldest</option>
            </select>
          </div>
          <div className="border-[#E4E4E7] rounded-[12px] px-[8px] text-[14px] border-[1px] h-[36px] w-[93px]">
            <select className="rounded-lg w-full h-full outline-none">
              <option>Project</option>
              <option>Project A</option>
              <option>Project B</option>
            </select>
          </div>
        </div>
      </div>

      {/* User Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filteredUsers?.map((user) => (
          <div key={user.id} onClick={() => setSelectedUser(user)}>
            <UserCard user={user} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Submission;
