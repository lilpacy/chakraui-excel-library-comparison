import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { Box, Container, Text } from "@chakra-ui/react";
import { redirect } from "next/navigation";
import { getProfile } from "@/app/actions/profile";
import { pageTitleProps, sectionDescriptionProps, surfaceBoxProps } from "@/app/design-system/patterns";
import { ProfileForm } from "./components/ProfileForm";

export const metadata = {
  title: "Profile",
  description: "Manage your profile",
};

export default async function ProfilePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const profile = await getProfile();

  return (
    <Container maxW="2xl" px={{ base: 4, md: 6 }} py={{ base: 8, md: 10 }}>
      <Box mb="8">
        <Text as="h1" mb="2" {...pageTitleProps}>
          Profile
        </Text>
        <Text {...sectionDescriptionProps}>Manage your profile settings</Text>
      </Box>

      <Box {...surfaceBoxProps} p={{ base: 5, md: 6 }}>
        <Suspense fallback={<div>Loading profile...</div>}>
          <ProfileForm profile={profile} />
        </Suspense>
      </Box>
    </Container>
  );
}
