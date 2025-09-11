'use client';
import React, { useState } from 'react';
import Image from 'next/image';

type User = {
  id: number;
  name: string;
  role: string;
  location: string;
  wallet: string;
  image?: string;
  projectLink?: string;
  description?: string;
  submittedOn?: string;
  status?: 'pending' | 'winner' | 'disqualified';
};

interface SubmissionDetailProps {
  user: User;
  onClose: () => void;
  onMarkAsWinner: (userId: number) => void;
  onDisqualify: (userId: number) => void;
  onAddToWinnersList: (userId: number) => void;
}

const getInitials = (name: string) => {
  const parts = name.split(' ');
  return parts.length > 1
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : parts[0][0].toUpperCase();
};

const SubmissionDetail: React.FC<SubmissionDetailProps> = ({
  user,
  onClose,
  onMarkAsWinner,
  onDisqualify,
  onAddToWinnersList,
}) => {
  const [currentStatus, setCurrentStatus] = useState(user.status || 'pending');
  const [showRankDropdown, setShowRankDropdown] = useState(false);
  const [selectedRank, setSelectedRank] = useState('1st Place');

  const handleMarkAsWinner = () => {
    setCurrentStatus('winner');
    onMarkAsWinner(user.id);
  };

  const handleDisqualify = () => {
    setCurrentStatus('disqualified');
    onDisqualify(user.id);
  };

  const handleAddToWinnersList = () => {
    onAddToWinnersList(user.id);
  };

  const handleAssignRank = () => {
    setShowRankDropdown(!showRankDropdown);
  };

  const selectRank = (rank: string) => {
    setSelectedRank(rank);
    setShowRankDropdown(false);
    // You can add additional logic here to handle rank assignment
  };

  const rankOptions = ['1st Place', '2nd Place', '3rd Place', 'Unassign Place'];

  return (
    <div
      className="absolute inset-0 bg-black/40 flex items-center justify-center"
      style={{ zIndex: 9999 }}
    >
      <div className="bg-white w-[640px] h-full overflow-y-auto justify-self-end ml-auto shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-black"
            >
              ←
            </button>
            <span className="text-gray-400">3 of 30</span>
          </div>
          <h2 className="text-lg font-semibold">Submission Detail</h2>
          <div className="w-6"></div> {/* Spacer for centering */}
        </div>

        <div className="p-6">
          {/* Winner Badge */}
          {currentStatus === 'winner' && (
            <div className="mb-4">
              <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Selected as Winner - 1st Place
              </span>
            </div>
          )}

          {/* Profile */}
          <div className="flex items-center gap-4 mb-6">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name}
                width={56}
                height={56}
                className="w-14 h-14 rounded-full object-cover"
              />
            ) : (
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-purple-500 text-white font-semibold">
                {getInitials(user.name)}
              </div>
            )}
            <div>
              <h3 className="font-semibold text-lg">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.role}</p>
              <p className="text-xs text-gray-400">
                Submitted on {user.submittedOn || 'June 20, 2025'}
              </p>
            </div>
          </div>

          {/* Project Link */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-2">Project Link</h4>
            <div className="flex items-center gap-2">
              <a
                href={`https://${user.projectLink || 'behance.folakemalik.com'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-sm"
              >
                {user.projectLink || 'www.behance.folakemalik.com'}
              </a>
              <button className="text-gray-400 hover:text-gray-600">↗</button>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-2">Description</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              {user.description ||
                'I designed a ghostly-themed NFT card UI using colour palette and elements from the Rust Undead collection. Let me know what you think about it'}
            </p>
          </div>

          {/* Assign Rank Section (for winners) */}
          {currentStatus === 'winner' && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-2">Assign Rank</h4>
              <div className="relative">
                <button
                  onClick={handleAssignRank}
                  className="w-full px-3 py-2 border rounded-lg text-left flex items-center justify-between hover:border-gray-400"
                >
                  <span className="text-sm">{selectedRank}</span>
                  <span className="text-gray-400">▼</span>
                </button>

                {showRankDropdown && (
                  <div className="absolute top-full left-0 right-0 bg-white border rounded-lg shadow-lg mt-1 z-10">
                    {rankOptions.map((rank) => (
                      <button
                        key={rank}
                        onClick={() => selectRank(rank)}
                        className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                      >
                        {rank}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            {currentStatus === 'pending' && (
              <>
                <button
                  onClick={handleMarkAsWinner}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  Mark as Winner
                </button>
                <button
                  onClick={handleDisqualify}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  Disqualify
                </button>
              </>
            )}

            {currentStatus === 'winner' && (
              <>
                <button
                  onClick={handleAssignRank}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  Assign Rank
                </button>
                <button
                  onClick={handleDisqualify}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                >
                  Disqualify
                </button>
              </>
            )}

            {currentStatus === 'winner' && (
              <button
                onClick={handleAddToWinnersList}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Add to Winners List
              </button>
            )}

            {currentStatus === 'disqualified' && (
              <div className="flex items-center">
                <span className="text-red-600 font-medium text-sm">
                  ❌ Disqualified
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetail;
