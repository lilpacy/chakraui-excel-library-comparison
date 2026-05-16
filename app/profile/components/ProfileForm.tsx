"use client";

import { useState, useTransition, useRef } from "react";
import { uploadProfileImage, deleteProfileImage } from "@/app/actions/profile";
import Image from "next/image";
import {
  Box,
  Button,
  HStack,
  Input,
  Separator,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  designSystemClassNames,
  helperTextProps,
  labelTextProps,
  sectionTitleProps,
} from "@/app/design-system/patterns";

type Profile = {
  userId: string;
  profileImageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
} | null | undefined;

export function ProfileForm({ profile }: { profile: Profile }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      const MAX_SIZE = 5 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        setError("File size must be less than 5MB");
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        await uploadProfileImage(formData);
        setSuccess("Profile image updated successfully!");
        setPreviewUrl(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        // Reload page to show updated image
        window.location.reload();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to upload image");
      }
    });
  };

  const handleDelete = () => {
    if (!confirm("Are you sure you want to delete your profile image?")) {
      return;
    }

    setError(null);
    setSuccess(null);

    startTransition(async () => {
      try {
        await deleteProfileImage();
        setSuccess("Profile image deleted successfully!");
        // Reload page to show changes
        window.location.reload();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete image");
      }
    });
  };

  return (
    <VStack gap="6" align="stretch">
      <Box>
        <Text as="h2" mb="4" {...sectionTitleProps}>
          Profile Image
        </Text>

        {profile?.profileImageUrl && !previewUrl && (
          <Box mb="4">
            <Text {...labelTextProps}>
              Current image:
            </Text>
            <Box
              boxSize="32"
              rounded="full"
              overflow="hidden"
              bg="bg.subtle"
              position="relative"
            >
              <Image
                src={`/api/images/${profile.profileImageUrl}`}
                alt="Profile"
                fill
                style={{ objectFit: "cover" }}
              />
            </Box>
            <Text mt="2" {...helperTextProps}>
              Image stored in R2: {profile.profileImageUrl}
            </Text>
          </Box>
        )}

        {previewUrl && (
          <Box mb="4">
            <Text {...labelTextProps}>
              Preview:
            </Text>
            <Box
              boxSize="32"
              rounded="full"
              overflow="hidden"
              bg="bg.subtle"
              position="relative"
            >
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                style={{ objectFit: "cover" }}
              />
            </Box>
          </Box>
        )}

        <form onSubmit={handleSubmit}>
          <VStack gap="4" align="stretch">
            <Box>
              <label htmlFor="image">
                <Text {...labelTextProps}>Upload new image</Text>
              </label>
              <Input
                ref={fileInputRef}
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isPending}
                p="1.5"
              />
              <Text mt="1" {...helperTextProps}>
                Max file size: 5MB. Supported formats: JPG, PNG, GIF
              </Text>
            </Box>

            {error && (
              <Box className={designSystemClassNames.statusError}>
                {error}
              </Box>
            )}

            {success && (
              <Box className={designSystemClassNames.statusSuccess}>
                {success}
              </Box>
            )}

            <HStack gap="3" flexWrap="wrap">
              <Button
                type="submit"
                disabled={isPending || !previewUrl}
                colorPalette="brand"
              >
                {isPending ? "Uploading..." : "Upload Image"}
              </Button>

              {profile?.profileImageUrl && (
                <Button
                  type="button"
                  onClick={handleDelete}
                  disabled={isPending}
                  variant="outline"
                  colorPalette="red"
                >
                  Delete Current Image
                </Button>
              )}
            </HStack>
          </VStack>
        </form>
      </Box>

      <Box>
        <Separator mb="6" />
        <Text as="h3" {...labelTextProps}>
          Storage Information
        </Text>
        <Text fontSize="sm" color="fg.muted">
          Your profile images are securely stored in Cloudflare R2 object
          storage. Images are automatically optimized and served globally
          through Cloudflare&apos;s CDN.
        </Text>
      </Box>
    </VStack>
  );
}
