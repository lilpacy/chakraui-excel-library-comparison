"use client";

import { useState, useTransition } from "react";
import { Box, Button, Input, Text, Textarea, VStack } from "@chakra-ui/react";
import { createTodo } from "@/app/actions/todos";
import {
  designSystemClassNames,
  labelTextProps,
  sectionTitleProps,
} from "@/app/design-system/patterns";
import { useRouter } from "next/navigation";

export function CreateTodoForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    startTransition(async () => {
      try {
        await createTodo({
          title: title.trim(),
          description: description.trim() || undefined,
          completed: false,
        });
        setTitle("");
        setDescription("");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create todo");
      }
    });
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      borderWidth="1px"
      rounded="lg"
      p={{ base: 4, md: 5 }}
      className={designSystemClassNames.surfaceMuted}
    >
      <Text as="h2" mb="4" {...sectionTitleProps}>
        Create New Todo
      </Text>

      {error && (
        <Box mb="4" className={designSystemClassNames.statusError}>
          {error}
        </Box>
      )}

      <VStack gap="4" align="stretch">
        <Box>
          <label htmlFor="title">
            <Text {...labelTextProps}>
              Title
            </Text>
          </label>
          <Input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isPending}
            placeholder="Enter todo title"
            maxLength={200}
          />
        </Box>

        <Box>
          <label htmlFor="description">
            <Text {...labelTextProps}>
              Description (optional)
            </Text>
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isPending}
            placeholder="Enter todo description"
            rows={3}
            maxLength={1000}
          />
        </Box>

        <Button
          type="submit"
          disabled={isPending || !title.trim()}
          colorPalette="brand"
        >
          {isPending ? "Creating..." : "Create Todo"}
        </Button>
      </VStack>
    </Box>
  );
}
