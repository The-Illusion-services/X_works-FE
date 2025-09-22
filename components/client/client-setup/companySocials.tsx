'use client';
import { useFormContext } from 'react-hook-form';
import { CompanyOnboardingFormValues } from '@/hooks/hook-stepper';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { LucideChevronLeft, LucideChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuthContext } from '@/context/auth-context';

type CompanySocialsProps = {
  handleBack: () => void;
  handleNext: () => void;
  step: number;
};

interface CompanyOnboardingData {
  bio: string;
  company_name: string;
  industry: string;
  company_size: string;
  company_address: string;
  country: string;
  city: string;
  primary_contact: string;
  phone_number: string;
  company_website?: string;
  linkedin_page?: string;
  other_media?: string;
}

const CompanySocials = ({
  handleBack,
  handleNext,
  step,
}: CompanySocialsProps) => {
  const { control, watch, setValue, getValues } =
    useFormContext<CompanyOnboardingFormValues>();
  const { accessToken } = useAuthContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const savedData = JSON.parse(
      localStorage.getItem('clientOnboardingData') || '{}',
    );

    if (savedData.company_website) {
      setValue('company_website', savedData.company_website);
    }
    if (savedData.linkedin_page) {
      setValue('linkedin_page', savedData.linkedin_page);
    }
    if (savedData.other_media) {
      setValue('other_media', savedData.other_media);
    }
  }, [setValue]);

  // Save data to localStorage when fields change
  const company_website = watch('company_website');
  const linkedin_page = watch('linkedin_page');
  const other_media = watch('other_media');

  useEffect(() => {
    const existingData = JSON.parse(
      localStorage.getItem('clientOnboardingData') || '{}',
    );

    const updatedData = {
      ...existingData,
      company_website: company_website || '',
      linkedin_page: linkedin_page || '',
      other_media: other_media || '',
    };

    localStorage.setItem('clientOnboardingData', JSON.stringify(updatedData));
  }, [company_website, linkedin_page, other_media]);

  // Function to submit company onboarding data
  const submitCompanyOnboarding = async (data: CompanyOnboardingData) => {
    try {
      const response = await fetch(
        `https://x-works-be.onrender.com/api/accounts/creator/onboarding/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(data),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Error submitting company onboarding:', error);
      throw error;
    }
  };

  // Update the handleNext function to always submit and then proceed
  const handleNextWithSave = async () => {
    try {
      setIsSubmitting(true);

      // Save current form data to localStorage first
      const existingData = JSON.parse(
        localStorage.getItem('clientOnboardingData') || '{}',
      );

      const updatedData = {
        ...existingData,
        company_website: company_website || '',
        linkedin_page: linkedin_page || '',
        other_media: other_media || '',
      };

      localStorage.setItem('clientOnboardingData', JSON.stringify(updatedData));

      // Get all data from localStorage for submission
      const savedData = updatedData;

      // Get current form data
      const formData = getValues();

      // Merge localStorage data with current form data
      const completeData: CompanyOnboardingData = {
        bio: savedData.bio || formData.bio || '',
        company_name: savedData.company_name || formData.company_name || '',
        industry: savedData.industry || formData.industry || '',
        company_size: savedData.company_size || formData.company_size || '',
        company_address:
          savedData.company_address || formData.company_address || '',
        country: savedData.country || formData.country || '',
        city: savedData.city || formData.city || '',
        primary_contact:
          savedData.primary_contact || formData.primary_contact || '',
        phone_number: savedData.phone_number || formData.phone_number || '',
        company_website: company_website || '',
        linkedin_page: linkedin_page || '',
        other_media: other_media || '',
      };

      // Validate required fields
      const requiredFields = [
        'bio',
        'company_name',
        'industry',
        'company_size',
        'company_address',
        'country',
        'city',
        'primary_contact',
        'phone_number',
      ];

      const missingFields = requiredFields.filter(
        (field) => !completeData[field as keyof CompanyOnboardingData],
      );

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Submit the data to API
      await submitCompanyOnboarding(completeData);

      // Clear localStorage after successful submission
      localStorage.removeItem('clientOnboardingData');

      console.log('Company onboarding submitted successfully');

      // Only proceed to next step if API call was successful
      handleNext();
    } catch (error) {
      console.error('Error submitting company onboarding:', error);
      // You might want to show an error message to the user here
      alert('Error submitting company onboarding. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <main className="mt-12 lg:px-5">
        <div className="max-w-screen-lg mx-auto w-full">
          <p className="font-circular font-bold text-[#7E8082]">{step - 1}/5</p>

          <h1 className="font-poppins font-semibold text-[24px] mt-1">
            <span className="text-[#7E8082]">Show them who you are! </span>Show
            Off Your Online Footprint
          </h1>

          <p className="text-[#7E8082] font-circular text-[14px] max-w-screen-md">
            Add a contact person from your team so we know who to talk to when
            it matters.
          </p>

          <div className="bg-white relative rounded-xl px-3 py-5 lg:p-10 mt-9 font-circular ">
            <FormField
              control={control}
              name="company_website"
              render={({ field }) => (
                <FormItem className="mb-[20px]">
                  <FormLabel className="text-[#545756] font-circular">
                    Company website
                  </FormLabel>

                  <FormControl>
                    <Input
                      className="h-12 bg-white placeholder:font-circular border-gray-300 font-circular placeholder:text-[#BEBEBE]"
                      placeholder="Enter company website"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-circular font-normal" />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="linkedin_page"
              render={({ field }) => (
                <FormItem className="mb-[20px]">
                  <FormLabel className="text-[#545756] font-circular">
                    Linkedin page
                  </FormLabel>

                  <FormControl>
                    <Input
                      className="h-12 bg-white placeholder:font-circular border-gray-300 font-circular placeholder:text-[#BEBEBE]"
                      placeholder="Enter linkedin link"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-circular font-normal" />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="other_media"
              render={({ field }) => (
                <FormItem className="mb-[20px]">
                  <FormLabel className="text-[#545756] font-circular">
                    Other social media (optional)
                  </FormLabel>

                  <FormControl>
                    <Input
                      className="h-12 bg-white placeholder:font-circular border-gray-300 font-circular placeholder:text-[#BEBEBE]"
                      placeholder="Enter other social media link"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs font-circular font-normal" />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end bottom-5 right-5 font-circular font-medium space-x-3 mt-6 lg:mt-12">
              <Button
                onClick={handleBack}
                className="flex flex-1 lg:flex-0 h-[48px] hover:bg-white/80 items-center space-x-3 text-primary bg-transparent border border-primary"
              >
                <LucideChevronLeft />
                <p className="">Back</p>
              </Button>

              <Button
                onClick={handleNextWithSave}
                disabled={isSubmitting}
                className="flex flex-1 lg:flex-0 h-[48px] items-center space-x-3 bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <p>Submitting...</p>
                ) : (
                  <>
                    <p>Next</p>
                    <LucideChevronRight />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default CompanySocials;
