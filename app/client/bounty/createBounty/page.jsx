'use client';
import React, { useState, useEffect } from 'react';
import { ChevronLeft, Plus, X } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import Link from 'next/link';

const MultiStepForm = () => {
  const { accessToken } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [newSkill, setNewSkill] = useState('');
  const [formData, setFormData] = useState({
    bountyTitle: '',
    category: '',
    skillsRequired: [],
    prizeStructure: 'Amount per Winner',
    prizes: [
      { place: '1st Place', amount: '5000', currency: 'ATOM' },
      { place: '2nd Place', amount: '3000', currency: 'ATOM' },
      { place: '3rd Place', amount: '2000', currency: 'ATOM' },
    ],
    startDate: '',
    submissionDeadline: '',
    winnerAnnouncement: '',
    description: '',
    problemStatement: '',
    whatYoullBuild: '',
  });

  const suggestedSkills = [
    'Branding',
    'Product Design',
    'Web Developer',
    'Business Presentation',
    'Animation',
    'Software Developer',
    'Marketing',
    'Blockchain Analyst',
    'Electrical Engineer',
  ];
  const totalSteps = 6;

  // Load form data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('bountyFormData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed);
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
    }
  }, []);

  // Save to localStorage whenever formData changes
  useEffect(() => {
    localStorage.setItem('bountyFormData', JSON.stringify(formData));
  }, [formData]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSkillAdd = (skill) => {
    if (skill.trim() && !formData.skillsRequired.includes(skill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skillsRequired: [...prev.skillsRequired, skill.trim()],
      }));
    }
  };

  const handleManualSkillAdd = () => {
    if (newSkill.trim()) {
      handleSkillAdd(newSkill);
      setNewSkill('');
    }
  };

  const handleSkillKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleManualSkillAdd();
    }
  };

  const handleSkillRemove = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skillsRequired: prev.skillsRequired.filter((s) => s !== skill),
    }));
  };

  const handlePrizeChange = (index, field, value) => {
    const newPrizes = [...formData.prizes];
    newPrizes[index][field] = value;
    setFormData((prev) => ({ ...prev, prizes: newPrizes }));
  };

  const addPrize = () => {
    const newPlace = `${formData.prizes.length + 1}${getOrdinalSuffix(formData.prizes.length + 1)} Place`;
    setFormData((prev) => ({
      ...prev,
      prizes: [
        ...prev.prizes,
        { place: newPlace, amount: '500', currency: 'ATOM' },
      ],
    }));
  };

  const getOrdinalSuffix = (num) => {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return 'st';
    if (j === 2 && k !== 12) return 'nd';
    if (j === 3 && k !== 13) return 'rd';
    return 'th';
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const prizeTypeMap = {
    'Single Prize': 'single',
    'Amount per Winner': 'multiple',
  };

  const submitToAPI = async () => {
    try {
      // Get the latest data from localStorage
      const savedData = localStorage.getItem('bountyFormData');
      const latestFormData = savedData ? JSON.parse(savedData) : formData;

      // Transform the data to match the API schema
      const payload = {
        title: latestFormData.bountyTitle,
        category: latestFormData.category,
        skills_required: latestFormData.skillsRequired,
        problem_statement: latestFormData.problemStatement,
        prize_type: prizeTypeMap[latestFormData.prizeStructure],
        // Handle different prize structures based on schema
        single_prize_amount:
          latestFormData.prizeStructure === 'Single Prize'
            ? latestFormData.prizes[0]?.amount
            : null,
        first_place_amount:
          latestFormData.prizeStructure !== 'Single Prize'
            ? latestFormData.prizes[0]?.amount
            : null,
        second_place_amount:
          latestFormData.prizeStructure !== 'Single Prize'
            ? latestFormData.prizes[1]?.amount
            : null,
        third_place_amount:
          latestFormData.prizeStructure !== 'Single Prize'
            ? latestFormData.prizes[2]?.amount
            : null,
        start_date: latestFormData.startDate,
        end_date: latestFormData.submissionDeadline,
      };

      // TODO: Replace with your actual API endpoint
      const API_ENDPOINT = `https://x-works-be.onrender.com/api/create-bounty/`;

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Bounty submitted successfully:', result);

      // Clear localStorage after successful submission
      localStorage.removeItem('bountyFormData');

      alert('Bounty submitted successfully!');
    } catch (error) {
      console.error('Error submitting bounty:', error);
      alert('Failed to submit bounty. Please try again.');
    }
  };

  const renderStep1 = () => (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">
          What's This Bounty About?
        </h2>
        <p className="text-gray-600">
          Tell us the basics. What's the challenge? What type of work are you
          looking for? And how can creators reach you if they have questions?
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Bounty Title</label>
          <input
            type="text"
            placeholder="e.g Write a Vue Tutorial on Solana Technology"
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={formData.bountyTitle}
            onChange={(e) => handleInputChange('bountyTitle', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
          >
            <option value="">Select category</option>
            <option value="design">Design</option>
            <option value="development">Development</option>
            <option value="marketing">Marketing</option>
            <option value="content">Content</option>
            <option value="Writing">Writing</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Skills Required
          </label>

          {/* Manual skill input */}
          <div className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type a skill and press Enter"
                className="flex-1 p-2 border border-gray-300 rounded"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={handleSkillKeyPress}
              />
              <button
                type="button"
                onClick={handleManualSkillAdd}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          </div>

          {/* Selected skills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {formData.skillsRequired.map((skill) => (
              <span
                key={skill}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {skill}
                <X
                  size={14}
                  className="cursor-pointer hover:text-blue-600"
                  onClick={() => handleSkillRemove(skill)}
                />
              </span>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Suggested Skills
            </label>
            <div className="flex flex-wrap gap-2">
              {suggestedSkills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  onClick={() => handleSkillAdd(skill)}
                >
                  <Plus size={14} />
                  {skill}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">
          Let's Talk Rewards And Timing
        </h2>
        <p className="text-gray-600">
          Set the stakes! Define how much winners will earn, how many will get
          rewarded, and when everything kicks off and wraps up.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Prize Structure
          </label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={formData.prizeStructure}
            onChange={(e) =>
              handleInputChange('prizeStructure', e.target.value)
            }
          >
            <option value="Amount per Winner">Amount per Winner</option>
            <option value="Single Prize">Single Prize</option>
            <option value="Total Pool">Total Pool</option>
          </select>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Schedule</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Start Date
              </label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Submission Deadline
              </label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.submissionDeadline}
                onChange={(e) =>
                  handleInputChange('submissionDeadline', e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Winner Announcement Date
              </label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.winnerAnnouncement}
                onChange={(e) =>
                  handleInputChange('winnerAnnouncement', e.target.value)
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">
          Let's Talk Rewards And Timing
        </h2>
        <p className="text-gray-600">
          Set the stakes! Define how much winners will earn, how many will get
          rewarded, and when everything kicks off and wraps up.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Prize Structure
          </label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg"
            value={formData.prizeStructure}
            onChange={(e) =>
              handleInputChange('prizeStructure', e.target.value)
            }
          >
            <option value="Amount per Winner">Amount per Winner</option>
            <option value="Single Prize">Single Prize</option>
          </select>
        </div>

        <div className="space-y-4">
          {formData.prizes.map((prize, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-20 text-sm">{prize.place}</div>
              <input
                type="number"
                className="w-24 p-2 border border-gray-300 rounded text-sm"
                value={prize.amount}
                onChange={(e) =>
                  handlePrizeChange(index, 'amount', e.target.value)
                }
              />
              <div className="w-20 text-sm">{prize.currency}</div>
            </div>
          ))}
          <button
            type="button"
            onClick={addPrize}
            className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-2"
          >
            <Plus size={16} />
            Add a prize place
          </button>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Schedule</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Start Date
              </label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Submission Deadline
              </label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.submissionDeadline}
                onChange={(e) =>
                  handleInputChange('submissionDeadline', e.target.value)
                }
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Winner Announcement Date
              </label>
              <input
                type="date"
                className="w-full p-2 border border-gray-300 rounded"
                value={formData.winnerAnnouncement}
                onChange={(e) =>
                  handleInputChange('winnerAnnouncement', e.target.value)
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">
          Let's Talk Rewards And Timing
        </h2>
        <p className="text-gray-600">
          Set the stakes! Define how much winners will earn, how many will get
          rewarded, and when everything kicks off and wraps up.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="mb-4">
            <h3 className="font-medium mb-2">Prize Structure</h3>
            <div className="text-sm text-gray-600">
              {formData.prizeStructure}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-medium mb-2">Prize Amount</h3>
            <div className="text-2xl font-bold">
              {formData.prizeStructure === 'Single Prize'
                ? `${formData.prizes[0]?.amount || '0'} ${formData.prizes[0]?.currency || 'ATOM'}`
                : `${formData.prizes.reduce((sum, prize) => sum + parseInt(prize.amount || 0), 0)} ATOM Total`}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Schedule</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Start Date</div>
                <div>{formData.startDate || 'Not set'}</div>
              </div>
              <div>
                <div className="text-gray-600">Submission Deadline</div>
                <div>{formData.submissionDeadline || 'Not set'}</div>
              </div>
              <div>
                <div className="text-gray-600">Winner Announcement Date</div>
                <div>{formData.winnerAnnouncement || 'Not set'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2">
          What Should Participants Know?
        </h2>
        <p className="text-gray-600">
          Lay out the details! Describe what you need, exactly what they need to
          submit to win. And keep in mind if you like.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <div className="bg-white border rounded-lg p-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Problem Statement</h3>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Describe the problem that needs to be solved..."
                  value={formData.problemStatement}
                  onChange={(e) =>
                    handleInputChange('problemStatement', e.target.value)
                  }
                />
              </div>

              <div>
                <h3 className="font-semibold mb-2">What You'll Build</h3>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="8"
                  placeholder="Describe what participants need to build or deliver..."
                  value={formData.whatYoullBuild}
                  onChange={(e) =>
                    handleInputChange('whatYoullBuild', e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep6 = () => {
    const totalPrize = formData.prizes.reduce(
      (sum, prize) => sum + parseInt(prize.amount || 0),
      0,
    );

    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Review Bounty Details</h2>
          <p className="text-gray-600">
            Make sure all the information below is correct before submitting
            your bounty for publication. You can go back to make changes.
          </p>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              {formData.bountyTitle
                ? formData.bountyTitle.charAt(0).toUpperCase()
                : 'B'}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-1">
                {formData.bountyTitle || 'Untitled Bounty'}
              </h3>
              <div className="flex gap-4 text-sm text-gray-600 mb-2">
                <span>Personal • {formData.category || 'No category'}</span>
                <span>
                  Due: {formData.submissionDeadline || 'No deadline set'}
                </span>
              </div>
              <div className="flex gap-2 text-xs">
                {formData.skillsRequired.map((skill) => (
                  <span key={skill} className="bg-gray-100 px-2 py-1 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold mb-3">Description</h4>

              <div className="space-y-4 text-sm">
                {formData.problemStatement && (
                  <div>
                    <h5 className="font-medium mb-2">Problem Statement</h5>
                    <p className="text-gray-700">{formData.problemStatement}</p>
                  </div>
                )}

                {formData.whatYoullBuild && (
                  <div>
                    <h5 className="font-medium mb-2">What You'll Build</h5>
                    <div className="text-gray-700 whitespace-pre-line">
                      {formData.whatYoullBuild}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="mb-6">
                <h4 className="font-semibold mb-2">Prize</h4>
                <div className="text-3xl font-bold mb-2">
                  {totalPrize.toLocaleString()} ATOM
                </div>
                <div className="space-y-1 text-sm">
                  {formData.prizes.map((prize, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{prize.place}:</span>
                      <span>
                        {prize.amount} {prize.currency}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Timeline</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Start:</span>
                    <span>{formData.startDate || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Deadline:</span>
                    <span>{formData.submissionDeadline || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Winner Announcement:</span>
                    <span>{formData.winnerAnnouncement || 'Not set'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={submitToAPI}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium"
          >
            Publish
          </button>
        </div>
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      case 6:
        return renderStep6();
      default:
        return renderStep1();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/client/bounty">
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
                <ChevronLeft size={20} />
                Back
              </button>
            </Link>
            <h1 className="text-xl font-bold">
              <span className="text-blue-600">AT</span>work
            </h1>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>ATOM</span>
            <span>Que274...A5TB</span>
          </div>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="bg-white border-b px-6 py-2">
        <div className="max-w-6xl mx-auto">
          <div className="text-sm text-gray-600">
            {currentStep}/{totalSteps}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 py-8">{renderCurrentStep()}</div>

      {/* Footer navigation */}
      {currentStep < 6 && (
        <div className="bg-white border-t px-6 py-4">
          <div className="max-w-6xl mx-auto flex justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiStepForm;
