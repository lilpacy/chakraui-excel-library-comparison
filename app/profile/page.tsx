import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { Box, Container, Text } from "@chakra-ui/react";
import { redirect } from "next/navigation";
import { getProfile } from "@/app/actions/profile";
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
        <Text as="h1" fontSize="3xl" fontWeight="bold" mb="2">
          Profile
        </Text>
        <Text color="gray.600">Manage your profile settings</Text>
      </Box>

      <Box bg="whiteAlpha.900" borderWidth="1px" rounded="xl" boxShadow="sm" p={{ base: 5, md: 6 }}>
        <Suspense fallback={<div>Loading profile...</div>}>
          <ProfileForm profile={profile} />
        </Suspense>
      </Box>
    </Container>
  );
}
