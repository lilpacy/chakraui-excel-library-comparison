import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";
import { Center } from "@chakra-ui/react";

export const metadata: Metadata = {
  title: "Sign Up",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function SignUpPage() {
  return (
    <Center minH="100vh" px="4">
      <SignUp />
    </Center>
  );
}
