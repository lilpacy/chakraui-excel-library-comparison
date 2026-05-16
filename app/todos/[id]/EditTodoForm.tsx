"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Checkbox,
  HStack,
  Input,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { updateTodo } from "@/app/actions/todos";

type Todo = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
};

export function EditTodoForm({ todo }: { todo: Todo }) {
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || "");
  const [completed, setCompleted] = useState(todo.completed);
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
        await updateTodo(todo.id, {
          title: title.trim(),
          description: description.trim() || undefined,
          completed,
        });
        router.push("/todos");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update todo");
      }
    });
  };

  const handleCancel = () => {
    router.push("/todos");
  };

  return (
    <Box as="form" onSubmit={handleSubmit} borderWidth="1px" rounded="xl" p={{ base: 5, md: 6 }} bg="whiteAlpha.900">
      {error && (
        <Box
          mb="4"
          p="3"
          bg="red.50"
          borderWidth="1px"
          borderColor="red.200"
          color="red.700"
          rounded="md"
        >
          {error}
        </Box>
      )}

      <VStack gap="4" align="stretch">
        <Box>
          <label htmlFor="title">
            <Box display="block" fontSize="sm" fontWeight="medium" mb="1">
              Title
            </Box>
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
            <Box display="block" fontSize="sm" fontWeight="medium" mb="1">
              Description (optional)
            </Box>
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isPending}
            placeholder="Enter todo description"
            rows={4}
            maxLength={1000}
          />
        </Box>

        <Checkbox.Root
            id="completed"
            checked={completed}
            disabled={isPending}
            onCheckedChange={(details) => setCompleted(details.checked === true)}
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>Mark as completed</Checkbox.Label>
          </Checkbox.Root>

        <HStack gap="3" pt="4" align="stretch">
          <Button
            type="submit"
            disabled={isPending || !title.trim()}
            flex="1"
            colorPalette="blue"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            type="button"
            onClick={handleCancel}
            disabled={isPending}
            flex="1"
            variant="outline"
          >
            Cancel
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}
