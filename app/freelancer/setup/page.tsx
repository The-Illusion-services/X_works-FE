'use client';

import { useForm } from 'react-hook-form';
import { useCallback, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { LucideCheck, LucideInfo } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { GetCity, GetCountries, GetState } from 'react-country-state-city';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import Image from 'next/image';
import { Box, Callout, Flex, Heading, Text } from '@radix-ui/themes';
import { EmptyUserIcon } from '@/icons/EmptyUserIcon';
import { CameraIcon } from '@/icons/Camera';
import CalendarIcon from '@/icons/Calendar';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { ApplicationRoutes } from '@/config/routes';
import { useXionWallet } from '@/context/xion-context';
import { PhoneInput } from '@/components/freelancer/phone-input';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const FormSchema = z.object({
  profile_picture: z
    .instanceof(File, { message: 'Please upload a profile picture' })
    .nullable()
    .optional(),
  name: z.string().min(1, { message: 'Name must be at least 2 characters' }),
  email: z
    .string()
    .email({ message: 'Please enter a valid email address' })
    .optional(),
  phone_number: z
    .string()
    .min(10, { message: 'Please enter a valid phone number' }),
  date_of_birth: z.date({
    required_error: 'A date of birth is required.',
  }),
  country: z.string().min(1, { message: 'Please select your country' }),
  state: z.string().min(1, { message: 'Please select your state' }),
  city: z.string().min(1, { message: 'Please select your cuty' }),
  street_address: z
    .string()
    .min(5, { message: 'Please enter your steet address' }),
  zip_code: z.string().min(3, { message: 'Please enter a valid postal code' }),
  terms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms and conditions' }),
  }),
});

export default function Page() {
  const { isConnected } = useXionWallet();
  const router = useRouter();

  // Form state
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      profile_picture: null,
      name: '',
      email: '',
      phone_number: '',
      date_of_birth: new Date(),
      country: '',
      state: '',
      city: '',
      street_address: '',
      zip_code: '',
    },
  });

  interface Country {
    id: number;
    name: string;
    emoji?: string;
  }

  interface State {
    id: number;
    name: string;
  }

  interface City {
    id: number;
    name: string;
  }

  const { control, watch, setValue, trigger, formState } = form;
  const { errors, isValid, isDirty } = formState;

  // Watch for changes in fields
  const selectedCountry = watch('country');
  const profilePicture = watch('profile_picture');
  const termsAccepted = watch('terms');

  // @ts-expect-error "Negligible Error"
  // @typescript-eslint/no-unused-vars
  const [, setImageFile] = useState<File>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  const [countries, setCountries] = useState<Country[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState<string>('');
  const [selectedStateId, setSelectedStateId] = useState<string>('');

  // Load countries on component mount
  useEffect(() => {
    const loadCountries = async () => {
      const countriesData = await GetCountries();
      // Cast to Country[] since the API response should have these properties
      setCountries(countriesData as unknown as Country[]);
    };
    loadCountries();
  }, []);

  // Load states when country changes
  useEffect(() => {
    const loadStates = async () => {
      if (selectedCountryId) {
        const statesData = await GetState(parseInt(selectedCountryId));
        // Cast to State[] since the API response should have these properties
        setStates(statesData as unknown as State[]);
        // Clear state and city when country changes
        setValue('state', '');
        setValue('city', '');
        setCities([]);
      }
    };
    loadStates();
  }, [selectedCountryId, setValue]);

  // Load cities when state changes
  useEffect(() => {
    const loadCities = async () => {
      const selectedStateName = watch('state');
      if (selectedCountryId && selectedStateName) {
        // Find the state ID from the state name
        const selectedStateObj = states.find(
          (state) => state.name === selectedStateName,
        );

        if (selectedStateObj) {
          const citiesData = await GetCity(
            parseInt(selectedCountryId),
            selectedStateObj.id,
          );
          // Cast to City[] since the API response should have these properties
          setCities(citiesData as unknown as City[]);
          setValue('city', '');
        }
      }
    };
    loadCities();
  }, [selectedCountryId, watch, setValue, states]);

  // Reset state and city when country changes
  useEffect(() => {
    if (selectedCountry) {
      setValue('state', '');
      setValue('city', '');
      // Trigger validation after clearing fields
      trigger(['state', 'city']);
    }
  }, [selectedCountry, setValue, trigger]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Cleanup function to revoke object URL when component unmounts
  useEffect(() => {
    return () => {
      if (
        previewImageUrl &&
        previewImageUrl !== '/images/freelancer/file.svg'
      ) {
        URL.revokeObjectURL(previewImageUrl);
      }
    };
  }, [previewImageUrl]);

  // Update preview when profile_picture changes in form context
  useEffect(() => {
    if (profilePicture instanceof File) {
      // Cleanup previous preview URL if it exists
      if (
        previewImageUrl &&
        previewImageUrl !== '/images/freelancer/file.svg'
      ) {
        URL.revokeObjectURL(previewImageUrl);
      }
      const newPreviewUrl = URL.createObjectURL(profilePicture);
      setPreviewImageUrl(newPreviewUrl);
      setImageFile(profilePicture);
    }
  }, [previewImageUrl, profilePicture]);

  // This form instance is no longer needed as we've defined it above
  // const form = useForm<z.infer<typeof FormSchema>>({
  //   resolver: zodResolver(FormSchema),
  // });

  const validateImage = (file: File): string | null => {
    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return 'File size must be less than 5MB';
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return 'Please upload a valid image file (JPG, PNG, or GIF)';
    }

    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate the file
    const error = validateImage(file);
    if (error) {
      alert(error);
      e.target.value = ''; // Reset the input
      return;
    }

    // Cleanup previous preview URL if it exists
    if (previewImageUrl && previewImageUrl !== '/images/freelancer/file.svg') {
      URL.revokeObjectURL(previewImageUrl);
    }

    // Create new preview URL
    const newPreviewUrl = URL.createObjectURL(file);
    setPreviewImageUrl(newPreviewUrl);
    setImageFile(file);
    setValue('profile_picture', file, { shouldValidate: true });
  };

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      // Here you would typically send the data to your API
      console.log('Form data submitted:', data);
      localStorage.setItem(
        'freelancerOnboardingData',
        JSON.stringify({
          ...JSON.parse(
            localStorage.getItem('freelancerOnboardingData') || '{}',
          ),
          ...data,
        }),
      );

      toast.success('Account created successfully!', {
        description: 'You can now start using your freelancer account.',
      });

      router.push('/freelancer/setup/onboarding');
      // Redirect to dashboard or next step
      // window.location.href = ApplicationRoutes.FREELANCER_DASHBOARD;
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error('Failed to create account', {
        description:
          'Please try again or contact support if the issue persists.',
      });
    }
  }

  const renderImage = useCallback(() => {
    return (
      <div className="relative w-32 h-32 rounded-full transition-colors">
        {previewImageUrl ? (
          <Image
            src={previewImageUrl}
            alt=""
            className="w-full h-full object-cover"
            width={100}
            height={100}
          />
        ) : (
          <>
            <EmptyUserIcon width={128} height={128} />
            <div className="absolute bottom-0 right-0 bg-background rounded-full p-1.5 border-muted border">
              <CameraIcon />
            </div>
          </>
        )}
        <div className="absolute inset-0 bg-opacity-0 hover:bg-opacity-40 transition-opacity flex items-center justify-center">
          <span className="text-white opacity-0 hover:opacity-100 transition-opacity text-sm font-medium">
            Change Photo
          </span>
        </div>
      </div>
    );
  }, [previewImageUrl]);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="mb-36">
            <div className="w-full lg:max-w-xl mx-auto">
              {/*<p className="font-circular font-bold text-[#7E8082]">{step - 1}/5</p>*/}
              <Flex
                className={'w-4/5 mx-auto text-center'}
                direction={'column'}
                align={'center'}
                gap={'4'}
              >
                <Box>
                  <Heading className="font-poppins" size={'8'}>
                    Setup freelancer account
                  </Heading>

                  <p className="text-muted-foreground text-base mt-2 max-w-screen-md">
                    Complete your profile to attract more clients and showcase
                    your skills!
                  </p>
                </Box>

                {isConnected ? (
                  <Flex
                    align={'center'}
                    className={
                      'bg-[#DFFFED] border border-[#9BFFC5] h-14 leading-[48px] rounded-full'
                    }
                    gap={'4'}
                    px={'5'}
                  >
                    <Text color={'gray'} weight={'medium'}>
                      Wallet Connected
                    </Text>
                    <Flex
                      align={'center'}
                      justify={'center'}
                      className={'bg-[#2ECC71] rounded-full size-5 leading-5'}
                    >
                      <LucideCheck color={'white'} size={12} strokeWidth={3} />
                    </Flex>
                  </Flex>
                ) : (
                  <Flex
                    align={'center'}
                    className={
                      'bg-[#DFFFED] border border-[#9BFFC5] h-14 leading-[48px] rounded-full'
                    }
                    gap={'4'}
                    px={'5'}
                  >
                    <Text color={'gray'} weight={'medium'}>
                      Wallet Connected
                    </Text>
                    <Flex
                      align={'center'}
                      justify={'center'}
                      className={'bg-[#2ECC71] rounded-full size-5 leading-5'}
                    >
                      <LucideCheck color={'white'} size={12} strokeWidth={3} />
                    </Flex>
                  </Flex>
                )}
              </Flex>

              <div className="bg-background mx-auto relative rounded-xl p-10 mt-10 ">
                {/* Display a summary of errors at the top of the form */}
                {Object.keys(errors).length > 0 && (
                  <Callout.Root color="red" className={'mb-8'}>
                    <Callout.Icon>
                      <LucideInfo size={14} />
                    </Callout.Icon>
                    <Callout.Text>
                      Please fix the errors before you proceed.
                    </Callout.Text>
                  </Callout.Root>
                )}

                <div className="w-full space-y-8">
                  <div className="flex flex-col items-start gap-4 mb-8">
                    <Text weight={'bold'}>Upload Your Avatar</Text>
                    <div className="relative">
                      <Input
                        onChange={handleFileChange}
                        id="profile-upload"
                        type="file"
                        accept="image/jpeg,image/png,image/gif"
                        className="peer hidden"
                      />
                      <Label
                        htmlFor="profile-upload"
                        className="cursor-pointer"
                      >
                        {renderImage()}
                      </Label>
                    </div>

                    <div className="flex flex-col items-center gap-3">
                      {/*<Button
                        type="button"
                        onClick={() =>
                          document.getElementById('profile-upload')?.click()
                        }
                        variant="outline"
                        className="flex items-center gap-2 text-primary border-primary hover:bg-primary/10"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10 4.16667V15.8333M4.16667 10H15.8333"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Upload Photo
                      </Button>*/}
                      <p className="text-[#BEBEBE] text-sm font-circular">
                        JPG, PNG or GIF (max. 5MB)
                      </p>
                    </div>
                  </div>

                  <Flex className={'w-full'}>
                    <FormField
                      control={control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className={'w-full'}>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              className={'w-full h-12'}
                              placeholder="e.g., John Doe"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            <Text size={'1'}>
                              Your First Name and Last Name
                            </Text>
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </Flex>

                  <Flex className={'w-full'}>
                    <FormField
                      control={control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className={'w-full'}>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              className={'w-full h-12'}
                              placeholder="example@gmail.com"
                              type={'email'}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </Flex>

                  <Flex className={'w-full'}>
                    <FormField
                      control={control}
                      name="phone_number"
                      render={({ field }) => (
                        <FormItem className={'w-full'}>
                          <FormLabel className="">Phone Number</FormLabel>
                          <FormControl>
                            <PhoneInput className={'h-12'} {...field} />
                          </FormControl>
                          <FormMessage className="text-xs font-normal" />
                        </FormItem>
                      )}
                    />
                  </Flex>

                  <Flex className={'w-full'}>
                    <FormField
                      control={control}
                      name="date_of_birth"
                      render={({ field }) => (
                        <FormItem className="flex flex-col w-full">
                          <FormLabel>Date of birth</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={'outline'}
                                  className={cn(
                                    'w-full h-12 pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground',
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, 'PPP')
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <div className="ml-auto h-4 w-4 opacity-50">
                                    <CalendarIcon />
                                  </div>
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() ||
                                  date < new Date('1900-01-01')
                                }
                                captionLayout="dropdown"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            <Text size={'1'}>
                              Your date of birth is used to calculate your age.
                            </Text>
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </Flex>

                  <Flex className={'w-full'}>
                    <FormField
                      control={control}
                      name="country"
                      render={({ field }) => (
                        <FormItem className={'w-full'}>
                          <FormLabel className="">Country</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              // Find the country object to get both ID and name
                              const selectedCountryObj = countries.find(
                                (country) => country?.name === value,
                              );
                              if (selectedCountryObj) {
                                field.onChange(selectedCountryObj.name); // Store name in form

                                setSelectedCountryId(
                                  selectedCountryObj.id.toString(),
                                ); // Store ID for API
                              }
                            }}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full bg-transparent !h-12">
                                <SelectValue placeholder="Select your country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-background w-full max-h-[300px] overflow-y-auto">
                              {countries.map((country) => (
                                <SelectItem
                                  key={country?.id}
                                  value={country?.name}
                                  className="flex items-center gap-2"
                                >
                                  <span className="mr-2">{country?.emoji}</span>
                                  {country?.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-xs font-circular font-normal" />
                        </FormItem>
                      )}
                    />
                  </Flex>

                  <Flex
                    className={'w-full'}
                    align={'center'}
                    justify={'between'}
                    gap={'4'}
                  >
                    <Flex className={'w-full'}>
                      <FormField
                        control={control}
                        name="state"
                        render={({ field }) => (
                          <FormItem className={'w-full'}>
                            <FormLabel className="">State/Province</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                // Find the state object to get both ID and name
                                const selectedStateObj = states.find(
                                  (state) => state?.name === value,
                                );
                                if (selectedStateObj) {
                                  field.onChange(selectedStateObj.name); // Store name in form
                                  setSelectedStateId(
                                    selectedStateObj.id.toString(),
                                  ); // Store ID for API

                                  // Immediately trigger city loading
                                  const loadCities = async () => {
                                    const citiesData = await GetCity(
                                      parseInt(selectedCountryId),
                                      selectedStateObj.id,
                                    );
                                    setCities(citiesData as unknown as City[]);
                                    setValue('city', '');
                                  };
                                  loadCities();
                                }
                              }}
                              value={field.value}
                              disabled={!selectedCountryId}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full !h-12">
                                  <SelectValue placeholder="Select state/province" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-white max-h-[300px] overflow-y-auto">
                                {states.map((state) => (
                                  <SelectItem
                                    key={state.id}
                                    value={state?.name}
                                  >
                                    {state?.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-xs font-circular font-normal" />
                          </FormItem>
                        )}
                      />
                    </Flex>

                    <Flex className={'w-full'}>
                      <FormField
                        control={control}
                        name="city"
                        render={({ field }) => (
                          <FormItem className={'w-full'}>
                            <FormLabel className="">City</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={!selectedStateId}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full !h-12">
                                  <SelectValue placeholder="Select city" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="bg-background max-h-[300px] overflow-y-auto">
                                {cities.map((city) => (
                                  <SelectItem key={city.id} value={city?.name}>
                                    {city?.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-xs font-normal" />
                          </FormItem>
                        )}
                      />
                    </Flex>
                  </Flex>

                  <Flex
                    className={'w-full'}
                    align={'center'}
                    justify={'between'}
                    gap={'4'}
                  >
                    <Flex className={'w-full'}>
                      <FormField
                        control={control}
                        name="street_address"
                        render={({ field }) => (
                          <FormItem className={'w-full'}>
                            <FormLabel className="">Street address*</FormLabel>

                            <FormControl>
                              <Input
                                className="w-full h-12"
                                placeholder="No 1, first street, avenue..."
                                {...field}
                                onChange={(e) => {
                                  field.onChange(e);
                                  // Trigger validation on change
                                  trigger('street_address');
                                }}
                              />
                            </FormControl>
                            <FormMessage className="text-xs font-circular font-normal" />
                          </FormItem>
                        )}
                      />
                    </Flex>

                    <Flex className={'w-full'}>
                      <FormField
                        control={control}
                        name="zip_code"
                        render={({ field }) => (
                          <FormItem className={'w-full'}>
                            <FormLabel className="">ZIP/Postal code</FormLabel>

                            <FormControl>
                              <Input
                                className="h-12"
                                placeholder="Enter zip/postal code"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                    </Flex>
                  </Flex>

                  <FormField
                    control={control}
                    name="terms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id="terms"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel
                            htmlFor="terms"
                            className={
                              'font-normal flex flex-row items-center flex-wrap gap-0.5'
                            }
                          >
                            Yes, I agree to the
                            <Link
                              className={'text-primary'}
                              href={ApplicationRoutes.TERMS}
                            >
                              Terms of Service,
                            </Link>{' '}
                            <Link
                              className={'text-primary'}
                              href={ApplicationRoutes.USER_AGREEMENT}
                            >
                              User Agreement,
                            </Link>
                            and
                            <Link
                              className={'text-primary'}
                              href={ApplicationRoutes.PRIVACY}
                            >
                              Privacy Policy.
                            </Link>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <Flex direction={'column'}>
                    <Button
                      className={'h-12'}
                      disabled={!isValid || !termsAccepted || !isDirty}
                      variant={'default'}
                      size={'lg'}
                      type="submit"
                    >
                      Join as a Freelancer
                    </Button>
                  </Flex>

                  <Flex
                    align={'center'}
                    className={'text-center'}
                    gap={'1'}
                    justify={'center'}
                  >
                    <Text>Already have an account?</Text>
                    <Link className={'font-medium text-primary'} href={'/'}>
                      Sign in
                    </Link>
                  </Flex>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
