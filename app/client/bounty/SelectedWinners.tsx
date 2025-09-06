'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import { IoIosSearch } from 'react-icons/io';

type User = {
  id: number;
  name: string;
  role: string;
  location: string;
  wallet: string;
  image?: string; // optional
};

const users: User[] = [
  {
    id: 1,
    name: 'Folake Malik',
    role: 'Brand & UIUX Designer',
    location: 'Uyo, Akwa Ibom',
    wallet: '0xc574...A578',
    image: '',
  },
  {
    id: 2,
    name: 'Tunde Adebayo',
    role: 'Frontend Developer',
    location: 'Lagos, Nigeria',
    wallet: '0xabc12...D567',
  },
  {
    id: 3,
    name: 'Chioma Obi',
    role: 'Product Manager',
    location: 'Abuja, Nigeria',
    wallet: '0xffe45...C222',
    image: '',
  },
];

const getInitials = (name: string) => {
  const parts = name.split(' ');
  return parts.length > 1
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : parts[0][0].toUpperCase();
};

const UserCard: React.FC<{ user: User }> = ({ user }) => {
  return (
    <div className="flex items-center gap-4 p-4 border-[1px] border-[#E4E4E7] rounded-[14px]">
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
        <p className="text-[14px] text-[#7E8082]">
          {user.role} • {user.location}
        </p>
        <p className="text-[14px] text-[#7E8082]">{user.wallet}</p>
      </div>
    </div>
  );
};

const SelectedWinners: React.FC = () => {
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="p-6">
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
          <div className="border-[#E4E4E7] rounded-[12px] px-[8px] text-[14px]  rounded-[] border-[1px] h-[36px] w-[78px]">
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
        {filteredUsers.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default SelectedWinners;
