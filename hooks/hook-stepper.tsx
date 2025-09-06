import {
  ARRAY_FIELDS,
  FILE_FIELDS,
  STEPPER_FORM_KEYS_FOR_FREELANCER_SETUP,
} from '@/constants/freelancer-stepper-constant';

type ArrayFields = (typeof ARRAY_FIELDS)[number];
type FileFields = (typeof FILE_FIELDS)[number];

export type StepperFormKeysType =
  (typeof STEPPER_FORM_KEYS_FOR_FREELANCER_SETUP)[keyof typeof STEPPER_FORM_KEYS_FOR_FREELANCER_SETUP][number];

export type StepperFormValues = {
  [FieldName in StepperFormKeysType]: FieldName extends FileFields
    ? File | null
    : FieldName extends ArrayFields
      ? string[]
      : FieldName extends 'rate' | 'zipcode'
        ? number
        : FieldName extends 'isVoluntary'
          ? boolean
          : string;
};

export type CompanyOnboardingFormValues = {
  // Company Address step
  company_address: string;
  country: string;
  city: string;

  // Company Details step
  profile_picture: File | null;
  company_name: string;
  company_size: string;
  bio: string;
  industry: string;
  primary_contact: string;
  phone_number: string;
  company_website: string;
  linkedin_page: string;
  other_media: string;

  // Add other steps as needed
};
