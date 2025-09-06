import { useFormContext } from 'react-hook-form';
import { StepperFormValues } from '@/hooks/hook-stepper';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../ui/form';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Button } from '../../ui/button';
import { LucideChevronLeft, LucideChevronRight } from 'lucide-react';
import { useEffect } from 'react';

type BioDetailsProps = {
  handleBack: () => void;
  handleNext: () => void;
  step: number;
};

const BioDetails = ({ handleBack, handleNext, step }: BioDetailsProps) => {
  const {
    control,
    watch,
    setValue,
    // formState: { errors },
    // register,
  } = useFormContext<StepperFormValues>();

  // Watch for changes in bio fields
  const title = watch('title');
  const bio = watch('bio');

  useEffect(() => {
    window.scrollTo(0, 0);

    // Load saved data from localStorage when component mounts
    const savedData = JSON.parse(
      localStorage.getItem('freelancerOnboardingData') || '{}',
    );

    if (savedData.title) {
      setValue('title', savedData.title);
    }

    if (savedData.bio) {
      setValue('bio', savedData.bio);
    }
  }, [setValue]);

  // Save to localStorage whenever bio fields change
  useEffect(() => {
    const existingData = JSON.parse(
      localStorage.getItem('freelancerOnboardingData') || '{}',
    );

    const updatedData = {
      ...existingData,
      professional_title: title || '',
      bio: bio || '',
    };

    localStorage.setItem(
      'freelancerOnboardingData',
      JSON.stringify(updatedData),
    );
  }, [title, bio]);

  const handleNextWithSave = () => {
    // Final save before proceeding
    const existingData = JSON.parse(
      localStorage.getItem('freelancerOnboardingData') || '{}',
    );

    const updatedData = {
      ...existingData,
      title: title || '',
      bio: bio || '',
    };

    localStorage.setItem(
      'freelancerOnboardingData',
      JSON.stringify(updatedData),
    );

    handleNext();
  };

  return (
    <>
      <main className="mt-32 px-5 mb-36">
        <div className="max-w-screen-lg mx-auto w-full">
          <p className="font-circular font-bold text-[#7E8082]">{step - 1}/5</p>

          <h1 className="font-poppins font-semibold text-[32px] mt-1">
            <span className="text-[#7E8082]">Great! </span>Now, create a bio to
            showcase who you are
          </h1>

          <p className="text-[#7E8082] font-circular text-base mt-2">
            Enter your professional title in one sentence. Then, highlight your
            key strengths, what you excel at using clear paragraphs or bullet
            points. This helps clients quickly understand your expertise. You
            can always edit this later.
          </p>

          <div className="bg-white relative rounded-xl p-10 mt-9 pb-32 ">
            <div className="flex flex-col gap-y-8">
              <FormField
                control={control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#545756] font-circular">
                      Your Professional Title
                    </FormLabel>

                    <FormControl>
                      <Input
                        className="h-12 bg-white placeholder:font-circular border-gray-300 font-circular placeholder:text-[#BEBEBE]"
                        placeholder="Branding & UI/UX Design"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-circular font-normal" />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#545756] font-circular">
                      Your Bio
                    </FormLabel>

                    <FormControl>
                      <Textarea
                        className="min-h-24 bg-white resize-none placeholder:font-circular border-gray-300 font-circular placeholder:text-[#BEBEBE]"
                        placeholder="Highlight your key skills, experiences, and passions. This section is one of the first impressions clients will have of your profile, so make it clear and impactful."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-xs font-circular font-normal" />
                  </FormItem>
                )}
              />
            </div>

            <div className="absolute flex items-center bottom-5 right-5 font-circular font-medium space-x-3">
              <Button
                type="button"
                onClick={handleBack}
                className="flex hover:bg-white/80 items-center space-x-3 text-primary bg-transparent border border-primary"
              >
                <LucideChevronLeft />
                <p className="">Back</p>
              </Button>

              <Button
                type="button"
                onClick={handleNextWithSave}
                className="flex flex-1 lg:flex-0 h-[48px] items-center space-x-1 lg:space-x-3 bg-primary text-white"
              >
                <p className="">Next</p>
                <LucideChevronRight />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default BioDetails;
