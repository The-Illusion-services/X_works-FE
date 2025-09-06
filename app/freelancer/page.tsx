'use client';

import { PageBody, PageContainer } from '@/components/PageContainer';
import { Box, Flex, Grid, Heading, Separator, Text } from '@radix-ui/themes';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LucideBadgeCheck, SearchIcon } from 'lucide-react';
import { BookmarkIcon } from '@/icons/BookmarkIcon';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { ApplicationRoutes } from '@/config/routes';
import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useXionWallet } from '@/context/xion-context';

function JobCard() {
  return (
    <Card className={'shadow-none border-0'}>
      <CardHeader>
        <Flex align={'center'} gap={'2'} className={''}>
          <Image
            src="/avatar/avatar1.svg"
            alt="Company Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <Flex direction={'column'} className={''}>
            <CardTitle>Web Design - UI/UX</CardTitle>
            <CardDescription className={'leading-normal'}>
              Coinbase . Canada
            </CardDescription>
          </Flex>
        </Flex>
      </CardHeader>
      <CardContent className={'space-y-4'}>
        <Flex align={'center'} justify={'start'} gap={'2'}>
          <Text size={'2'}>
            <Text color={'gray'}>Hourly: </Text>
            <Text>{'50.0'} ATOM</Text>
          </Text>

          <Text>-</Text>

          <Text size={'2'}>
            <Text color={'gray'}>Est. Time: </Text>
            <Text>{'1 to 3 weeks'}</Text>
          </Text>
        </Flex>
        <Flex align={'center'} justify={'start'}>
          <Text>
            <Text size={'2'}>
              Our web designer is responsible for creating the visual layout and
              aesthetic of a website, including its overall design, user
              interface (UI), and user experience (UX), by utilizing graphic
              design principles in Figma, Illustrator and Photoshop and coding
              languages like HTML
            </Text>
          </Text>
        </Flex>
        <div className="flex flex-wrap gap-2 pt-2">
          {['Product Design', 'Branding', 'User Research'].map(
            (skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="px-3 py-1.5 rounded-full text-xs text-muted-foreground border-border"
              >
                {skill}
              </Badge>
            ),
          )}
        </div>
        <Flex align={'center'} justify={'between'}>
          <Flex align={'center'} gap={'1'}>
            <Text>
              <LucideBadgeCheck color={'white'} fill={'dodgerblue'} />
            </Text>
            <Text color={'gray'} size={'2'}>
              Funds verified
            </Text>
          </Flex>

          <Text size={'2'}>
            <Text color={'gray'}>Funding: </Text>
            <Text>{'50.5'} ATOM</Text>
          </Text>

          <Text size={'2'}>
            <Text color={'gray'}>Applicants: </Text>
            <Text>{'5 of 10'}</Text>
          </Text>
        </Flex>
        <Separator size={'4'} />
      </CardContent>
      <CardFooter className={'w-full justify-end'}>
        <Text align={'right'} size={'2'} color={'gray'}>
          Posted 3 hours ago
        </Text>
      </CardFooter>
    </Card>
  );
}

export default function Page() {
  const router = useRouter();
  const { isNewFreelanceUser } = useAuth();
  const { address } = useXionWallet();

  useEffect(() => {
    const fetchFreelancerProfile = async () => {
      if (!address) {
        return;
      }

      const { data: freelancer_profiles, error } = await supabase
        .from('freelancer_profiles')
        .select('*')
        .eq('wallet_address', address);

      if (error) {
        console.error('Error fetching freelancer profile:', error);
      } else {
        console.log('Freelancer profile:', freelancer_profiles);
      }
      return freelancer_profiles;
    };

    const freelancer_profile = fetchFreelancerProfile();

    freelancer_profile.then((res) => {
      if (res) {
        router.push(ApplicationRoutes.FREELANCER_DASHBOARD);
      }
      if (!res && isNewFreelanceUser) {
        router.push(ApplicationRoutes.FREELANCER_SETUP);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isNewFreelanceUser, router]);

  return (
    <PageContainer>
      <PageBody>
        <Flex
          direction={'column'}
          gap={'1'}
          className={
            'bg-gradient-to-tr from-black via-black to-purple-950 px-8 py-12 rounded-xl mb-6'
          }
        >
          <Heading className={'text-white leading-relaxed'} size={'8'}>
            Welcome Back, Onesty! Ready to Land Your Next Gig?
          </Heading>
          <Text className={'text-white leading-relaxed'}>
            New jobs are waiting. Find something cool and submit your winning
            proposal today.
          </Text>

          <Flex
            className={
              'border-2 border-muted-foreground rounded-lg focus-within:border-primary'
            }
            align={'center'}
            gap={'3'}
            mt={'4'}
            p={'1'}
          >
            <SearchIcon className={'ml-2'} color={'gray'} />
            <Input
              className={
                'bg-transparent ring-0 border-0 focus-visible:ring-0 focus-visible:border-0 focus-visible:outline p-0'
              }
              type="search"
              placeholder="Search skills here"
            />
            <Button className={'bg-primary'}>Search</Button>
          </Flex>
        </Flex>

        <Grid columns={'5'} gap={'4'}>
          <Flex className={'col-span-2'} direction={'column'} gap={'4'}>
            <JobCard />
            <JobCard />
            <JobCard />
          </Flex>

          <Box className={'col-span-3'}>
            <Card className={'border-0 shadow-none'}>
              <CardHeader>
                <Flex align={'center'} gap={'2'} className={''}>
                  <Image
                    src="/avatar/avatar1.svg"
                    alt="Company Logo"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <Flex direction={'column'} className={''}>
                    <CardTitle>Web Designer - UI/UX</CardTitle>
                    <CardDescription className={'leading-normal'}>
                      Coinbase . Canada
                    </CardDescription>
                  </Flex>
                </Flex>
                <Flex align={'center'} justify={'start'} gap={'2'}>
                  <Text size={'2'}>
                    <Text color={'gray'}>Hourly: </Text>
                    <Text>{'2.5'} ATOM</Text>
                  </Text>

                  <Text>-</Text>

                  <Text size={'2'}>
                    <Text color={'gray'}>Est. Time: </Text>
                    <Text>{'1 to 3 weeks'}</Text>
                  </Text>

                  <Text>-</Text>

                  <Text size={'2'}>
                    <Text color={'gray'}>Applicants: </Text>
                    <Text>{'5 to 10'}</Text>
                  </Text>
                </Flex>
              </CardHeader>
              <CardContent>
                <Flex direction={'row'} align={'center'} gap={'2'}>
                  <Button asChild className={'flex-1'} size={'lg'}>
                    <Link href={ApplicationRoutes.FREELANCER_SUBMIT_PROPOSAL}>
                      Submit Proposal
                    </Link>
                  </Button>
                  <Button variant={'outline'} size={'icon'}>
                    <BookmarkIcon />
                  </Button>
                </Flex>
                <Separator className={'my-8'} size={'4'} />

                <Flex direction={'column'} gap={'4'}>
                  <Heading>Project Description</Heading>
                  <Text>
                    UI/UX Designer Needed for Kids&apos; Reading App & Website
                    (First Few Pages Only – No Coding) Project Overview: I am
                    looking for a talented UI/UX designer to redesign the first
                    few pages of my kids&apos; reading app and website. The app
                    and website are already developed, but I am not happy with
                    the design of the following pages:
                  </Text>
                  <Text>
                    Home About Contact Login Language Selection This project is
                    strictly design-focused—I do not need any coding. The final
                    designs should be delivered in Figma, Adobe XD, or another
                    standard design tool.
                  </Text>
                  <Text>
                    What I’m Looking For:
                    <br /> ✅ A fresh, modern, and kid-friendly design.
                    <br /> ✅ A simple, intuitive, and engaging user interface.
                    <br /> ✅ Consistent with the theme of a digital library for
                    kids.
                    <br /> ✅ A clean and professional layout that appeals to
                    both children and parents.
                  </Text>
                  <Text>
                    Deliverables:
                    <br /> 🎨 High-quality UI/UX design for the specified pages.
                    <br /> 📁 Design files (Figma, Adobe XD, or similar).
                    <br /> 📌 Any necessary design explanations or notes.
                  </Text>
                  <Text>
                    Ideal Candidate:
                    <br /> 👩‍🎨 Experience in designing websites and apps for
                    children.
                    <br /> 🎨 Strong portfolio in UI/UX design.
                    <br /> 📚 Understanding of kids’ reading or educational apps
                    (a plus).
                    <br /> 💬 Good communication and ability to incorporate
                    feedback.
                  </Text>
                  <Text>
                    If you’re interested, please send me:
                    <br /> 1️⃣ Your portfolio or relevant design samples.
                    <br /> 2️⃣ Your estimated timeline for the project.
                    <br /> 3️⃣ Your pricing.
                    <br /> <br /> Looking forward to working with a creative
                    designer! 🚀-
                  </Text>
                </Flex>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </PageBody>
    </PageContainer>
  );
}
