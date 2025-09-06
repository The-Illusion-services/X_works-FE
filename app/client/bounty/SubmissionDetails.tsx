'use client';
import React from 'react';
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
}) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center top-0 left-0 justify-center z-50">
      <div className="bg-white w-[640px] max-h-[90vh] overflow-y-auto rounded-[16px] shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Submission Detail</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✕
          </button>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-4 mb-6">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name}
              className="w-14 h-14 rounded-full object-cover"
            />
          ) : (
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-purple-500 text-white font-semibold">
              {getInitials(user.name)}
            </div>
          )}
          <div>
            <h3 className="font-semibold">{user.name}</h3>
            <p className="text-sm text-gray-500">{user.role}</p>
            <p className="text-xs text-gray-400">
              Submitted on {user.submittedOn}
            </p>
          </div>
        </div>

        {/* Project Link */}
        {user.projectLink && (
          <div className="mb-4">
            <p className="font-medium">Project Link</p>
            <a
              href={`https://${user.projectLink}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {user.projectLink}
            </a>
          </div>
        )}

        {/* Description */}
        <div className="mb-6">
          <p className="font-medium">Description</p>
          <p className="text-sm text-gray-700 mt-1">{user.description}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {user.status === 'pending' && (
            <>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                Mark as Winner
              </button>
              <button className="px-4 py-2 border rounded-lg">
                Disqualify
              </button>
            </>
          )}
          {user.status === 'winner' && (
            <span className="text-green-600 font-semibold">
              ✅ Selected Winner
            </span>
          )}
          {user.status === 'disqualified' && (
            <span className="text-red-600 font-semibold">❌ Disqualified</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmissionDetail;
