'use client';
import React, { useState } from 'react';
import { IoIosSearch } from 'react-icons/io';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa6';
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

const Page = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  const MyBounties = [
    {
      status: 'Open',
      title: 'Create Thread: SpineDAO and the Healthcare Revolution in DeSci',
      role: 'Design',
      date: 'June 20, 2025',
      tags: ['Web Design', 'UI/UX Design', 'Prototyping'],
      funding: '50.5 ATOM',
      duration: 'Due in 4d',
    },
    {
      status: 'Closed',
      title: 'Airbills Pay x Fiat Router — Product Rebrand Bounty',
      role: 'Front-end',
      date: 'June 20, 2025',
      tags: ['Web Design', 'UI/UX Design', 'Prototyping'],
      funding: '50.5 ATOM',
      duration: 'Due in 4d',
    },
    {
      status: 'Open',
      title: 'MetaHealth — Patient Dashboard Redesign',
      role: 'UI/UX',
      date: 'July 2, 2025',
      tags: ['Product Design', 'Wireframing', 'User Research'],
      funding: '72 ATOM',
      duration: 'Due in 7d',
    },
  ];

  const tableData = [
    {
      title: 'Solana Summer Thread Contest',
      status: 'Open',
      category: 'Content Creation',
      submissions: 49,
      startDate: 'July 10',
      endDate: 'July 24',
    },
    {
      title: 'Build a Token Tracker',
      status: 'Judging',
      category: 'Development',
      submissions: 40,
      startDate: 'July 10',
      endDate: 'July 24',
    },
    {
      title: 'UI Redesign Challenge',
      status: 'Scheduled',
      category: 'UI/UX Design',
      submissions: 40,
      startDate: 'July 10',
      endDate: 'July 24',
    },
    {
      title: 'Create Thread: SpineDAO and the Healthcare Revolution',
      status: 'Closed',
      category: 'Content Creation',
      submissions: 3,
      startDate: 'July 10',
      endDate: 'July 24',
    },
    {
      title: 'Airbills Pay x Fiat Router — Product Rebrand Bounty',
      status: 'In Progress',
      category: 'UI/UX Design',
      submissions: 49,
      startDate: 'July 10',
      endDate: 'July 24',
    },
    {
      title: 'UI Redesign Challenge',
      status: 'Scheduled',
      category: 'UI/UX Design',
      submissions: 40,
      startDate: 'July 10',
      endDate: 'July 24',
    },
    {
      title: 'Solana Summer Thread Contest',
      status: 'Scheduled',
      category: 'UI/UX Design',
      submissions: 2,
      startDate: 'July 10',
      endDate: 'July 24',
    },
  ];

  const statusColors: Record<
    string,
    'success' | 'error' | 'warning' | 'info' | 'default'
  > = {
    Open: 'success',
    Judging: 'warning',
    Scheduled: 'info',
    Closed: 'error',
    'In Progress': 'success',
  };

  return (
    <>
      <BountyDetailModal />
      <div>
        <h2 className="text-[40px] font-semibold tracking-[-2px] leading-[40px]">
          My Bounties
        </h2>
        <p className="text-[14px] font-medium text-[#7E8082]">
          You’ve received 14 new proposals across your posted jobs.
        </p>
        <div className="bg-white w-full rounded-[8px] py-[20px] mt-[20px]">
          <h3 className="text-[16px] text-[#18181B] font-semibold mx-[20px]">
            Proposal
          </h3>
          <div className="flex justify-between mt-[20px] px-[20px]">
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
          </div>
          {/* First Page Format */}
          {/* <div className="flex flex-col mt-[10px] px-[20px]">
          {MyBounties?.map((myBounty, i) => {
            return (
              <div
                className="flex flex-col p-[16px] rounded-[14px] hover:bg-[#F4F4F5] transition-all group"
                key={i}
              >
                <div
                  className={`${myBounty.status === 'Open' ? 'bg-[#10B9810D] text-[#10B981]' : 'bg-[#EF44440D] text-[#EF4444]'} font-semibold px-[8px] py-[4px] rounded-[12px] w-max text-[12px]`}
                >
                  {myBounty.status}
                </div>
                <h2 className="text-[18px] font-semibold mt-[5px] text-[#18181B]">
                  {myBounty.title}
                </h2>
                <p className="text-[#7E8082] text-[14px]">
                  {myBounty.role} ・ {myBounty.date}
                </p>
                <div className="flex mt-[20px] gap-[10px]">
                  {myBounty.tags.map((tag, i) => {
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
                    <span className="text-[#7E8082] mr-[5px]">Funding:</span>
                    {myBounty.funding}
                  </div>
                  <div className="text-[#545756] text-[14px]">
                    <span className="text-[#7E8082] mr-[5px]">Duration:</span>
                    Due in {myBounty.duration}
                  </div>
                </div>
              </div>
            );
          })}
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
                    <TableCell sx={{ fontWeight: 600, borderBottom: 'none' }}>
                      Submissions
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, borderBottom: 'none' }}>
                      Start Date
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, borderBottom: 'none' }}>
                      End Date
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {tableData.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{
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
                          color={statusColors[row.status] || 'default'}
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
                      <TableCell>{row.submissions}</TableCell>
                      <TableCell>{row.startDate}</TableCell>
                      <TableCell>{row.endDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <div className="flex text-[#18181B] px-[20px] justify-between items-center font-medium text-[14px] pt-[12px] pb-[16px] mt-[10px] border-t-[#ECECEC] border-t-[1px]">
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
                      onClick={() => handlePageClick(page)}
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
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
