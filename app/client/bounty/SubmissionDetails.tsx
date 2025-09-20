'use client';
import React, { useState } from 'react';
import Image from 'next/image';

type User = {
  id: string;
  name: string;
  application_text: string;
  applied_at: string;
  wallet: string;
  image?: string;
  projectLink?: string;
  description?: string;
  submittedOn?: string;
  status?: 'pending' | 'winner' | 'disqualified';
  bountyId: string; // Add bountyId to the user type
};

interface SubmissionDetailProps {
  user: User;
  onClose: () => void;
  onMarkAsWinner?: (userId: string) => void;
  onDisqualify?: (userId: string) => void;
  onAddToWinnersList?: (userId: string) => void;
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
  const [isAssigningRank, setIsAssigningRank] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // API call to assign placement
  const assignPlacement = async (placement: string) => {
    try {
      setIsAssigningRank(true);
      setErrorMessage('');
      setSuccessMessage('');

      const response = await fetch(
        `https://x-works-be.onrender.com/api/bounty/${user.bountyId}/application/${user.id}/select-winner/`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            is_winner: true,
            placement: placement,
          }),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to assign placement');
      }

      const result = await response.json();
      console.log('Placement assigned successfully:', result);

      // Update local state
      setCurrentStatus('winner');
      setSuccessMessage(`Successfully assigned ${placement}!`);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error assigning placement:', error);
      setErrorMessage('Failed to assign placement. Please try again.');
      // Clear error message after 5 seconds
      setTimeout(() => setErrorMessage(''), 5000);
    } finally {
      setIsAssigningRank(false);
    }
  };

  const handleMarkAsWinner = async () => {
    try {
      await assignPlacement('1st Place'); // Default to 1st place when marking as winner
      onMarkAsWinner?.(user.id);
    } catch (error) {
      console.error('Error marking as winner:', error);
    }
  };

  const handleDisqualify = () => {
    setCurrentStatus('disqualified');
    onDisqualify?.(user.id);
  };

  const handleAddToWinnersList = () => {
    onAddToWinnersList?.(user.id);
  };

  const handleAssignRank = () => {
    setShowRankDropdown(!showRankDropdown);
  };

  const selectRank = async (rank: string) => {
    setSelectedRank(rank);
    setShowRankDropdown(false);

    // Make API call to assign the selected rank
    if (rank !== 'Unassign Place') {
      await assignPlacement(rank);
    } else {
      // Handle unassigning - you might want to make another API call here
      setCurrentStatus('pending');
    }
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
          </div>
          <h2 className="text-lg font-semibold">Submission Detail</h2>
          <div className="w-6"></div>
        </div>

        <div className="p-6">
          {/* Success/Error Messages */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {errorMessage}
            </div>
          )}

          {/* Winner Badge */}
          {currentStatus === 'winner' && (
            <div className="mb-4">
              <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Selected as Winner - {selectedRank}
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
              <p className="text-xs text-gray-400">
                Submitted on {new Date(user.applied_at).toLocaleString()}
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

          {/* Assign Rank Section - Show for both pending and winner status */}
          <div className="mb-6">
            <h4 className="font-medium text-gray-900 mb-2">
              {currentStatus === 'winner' ? 'Current Rank' : 'Assign Rank'}
            </h4>
            <div className="relative">
              <button
                onClick={handleAssignRank}
                disabled={isAssigningRank}
                className="w-full px-3 py-2 border rounded-lg text-left flex items-center justify-between hover:border-gray-400 disabled:opacity-50"
              >
                <span className="text-sm">
                  {isAssigningRank
                    ? 'Assigning...'
                    : currentStatus === 'winner'
                      ? selectedRank
                      : 'Select rank to assign'}
                </span>
                <span className="text-gray-400">▼</span>
              </button>

              {showRankDropdown && (
                <div className="absolute top-full left-0 right-0 bg-white border rounded-lg shadow-lg mt-1 z-10">
                  {rankOptions.map((rank) => (
                    <button
                      key={rank}
                      onClick={() => selectRank(rank)}
                      disabled={isAssigningRank}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg disabled:opacity-50"
                    >
                      {rank}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {currentStatus === 'pending' && (
              <>
                <button
                  onClick={handleMarkAsWinner}
                  disabled={isAssigningRank}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                  {isAssigningRank
                    ? 'Processing...'
                    : 'Mark as Winner (1st Place)'}
                </button>
                <button
                  onClick={handleDisqualify}
                  disabled={isAssigningRank}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                >
                  Disqualify
                </button>
              </>
            )}

            {currentStatus === 'winner' && (
              <>
                <button
                  onClick={handleAddToWinnersList}
                  disabled={isAssigningRank}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                >
                  Add to Winners List
                </button>
                <button
                  onClick={handleDisqualify}
                  disabled={isAssigningRank}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50"
                >
                  Disqualify
                </button>
              </>
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
