'use client';

import {
  LucideChevronLeft,
  LucideChevronRight,
  LucidePlus,
} from 'lucide-react';
import { Button } from '../../ui/button';
import { useEffect, useState } from 'react';

type SkillsDetailsProps = {
  handleBack: () => void;
  handleNext: () => void;
  step: number;
};

const dummySkills = [
  'Branding',
  'Product Design',
  'Web Developer',
  'Business Presentation',
  'Blockchain Analyst',
  'Electrical Engineer',
  'Animation',
  'Software Developer',
  'Marketing',
];

const SkillsDetails = ({
  handleBack,
  handleNext,
  step,
}: SkillsDetailsProps) => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // Load skills from localStorage on component mount
  useEffect(() => {
    const savedData = JSON.parse(
      localStorage.getItem('freelancerOnboardingData') || '{}',
    );
    if (savedData.skills && Array.isArray(savedData.skills)) {
      setSelectedSkills(savedData.skills);
    }
  }, []);

  // Save to localStorage whenever selectedSkills changes
  useEffect(() => {
    if (selectedSkills.length > 0) {
      const existingData = JSON.parse(
        localStorage.getItem('freelancerOnboardingData') || '{}',
      );

      const updatedData = {
        ...existingData,
        skills: selectedSkills,
      };

      localStorage.setItem(
        'freelancerOnboardingData',
        JSON.stringify(updatedData),
      );
      console.log('Saved skills to localStorage:', selectedSkills);
    }
  }, [selectedSkills]);

  const handleAddSkill = (skill: string) => {
    if (selectedSkills.length >= 5) return;
    if (!selectedSkills.includes(skill)) {
      const newSkills = [...selectedSkills, skill];
      setSelectedSkills(newSkills);
    }
  };

  const handleRemoveSkill = (skill: string) => {
    const newSkills = selectedSkills.filter((s) => s !== skill);
    setSelectedSkills(newSkills);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Final save before proceeding
    const existingData = JSON.parse(
      localStorage.getItem('freelancerOnboardingData') || '{}',
    );

    const updatedData = {
      ...existingData,
      skills: selectedSkills,
    };

    localStorage.setItem(
      'freelancerOnboardingData',
      JSON.stringify(updatedData),
    );

    handleNext();
  };

  // Custom multi-select component since the imported one might not be working
  const CustomMultiSelector = () => {
    return (
      <div className="w-full border border-gray-300 rounded-lg p-3 min-h-[100px]">
        {selectedSkills.length === 0 ? (
          <p className="text-gray-500">Select up to 5 skills</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedSkills.map((skill) => (
              <div
                key={skill}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="mt-12 lg:px-5 mb-36">
        <div className="max-w-screen-lg mx-auto w-full">
          <p className="font-circular font-bold text-[#7E8082]">{step}/5</p>

          <h1 className="font-poppins font-semibold text-2xl mt-1">
            <span className="text-[#7E8082]">Almost there!</span> What work are
            you here to do?
          </h1>

          <div className="text-[#7E8082] font-circular mt-2">
            Your skills show clients what you can do and help us suggest the
            best jobs for you.{' '}
            <span className="text-[#545756]">
              Add, remove, or search for skills.
            </span>{' '}
            It&apos;s your choice!
          </div>

          <form onSubmit={handleFormSubmit}>
            <div className="bg-white relative rounded-xl p-10 mt-9 pb-20">
              <div className="w-full flex flex-col">
                <CustomMultiSelector />
                <p className="text-sm mt-[5px] ml-auto">Max 5 skills</p>
              </div>

              <div className="mt-6">
                <p className="text-base font-circular text-[#545756]">
                  Suggested skills
                </p>

                <div className="flex flex-wrap w-full mt-6 gap-4">
                  {dummySkills.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => handleAddSkill(skill)}
                      disabled={
                        selectedSkills.length >= 5 ||
                        selectedSkills.includes(skill)
                      }
                      className={`rounded-full flex items-center space-x-1 lg:space-x-2 cursor-pointer transition-colors font-circular text-base ${
                        selectedSkills.includes(skill)
                          ? 'bg-primary text-white'
                          : 'text-[#545756] hover:text-primary border border-gray-200'
                      } py-2 px-4`}
                    >
                      {!selectedSkills.includes(skill) && (
                        <LucidePlus size={20} />
                      )}
                      <p>{skill}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="absolute flex items-center bottom-5 right-5 font-circular font-medium space-x-3">
                <Button
                  type="button"
                  onClick={handleBack}
                  className="flex flex-1 lg:flex-0 h-[48px] hover:bg-white/80 items-center space-x-3 text-primary bg-transparent border border-primary"
                >
                  <LucideChevronLeft />
                  <p className="">Back</p>
                </Button>

                <Button
                  type="submit"
                  className="flex flex-1 lg:flex-0 h-[48px] items-center space-x-3 bg-primary text-white"
                >
                  <p className="">Next</p>
                  <LucideChevronRight />
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SkillsDetails;
