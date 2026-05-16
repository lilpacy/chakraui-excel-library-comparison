"use client";

import { format } from "date-fns";
import { deleteTodo, toggleTodoCompleted } from "@/app/actions/todos";
import { useState, useTransition } from "react";
import {
  Box,
  Button,
  Checkbox,
  HStack,
  Link as ChakraLink,
  Text,
  VStack,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { helperTextProps, surfaceBoxProps } from "@/app/design-system/patterns";

type Todo = {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export function TodoList({ todos }: { todos: Todo[] }) {
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    startTransition(async () => {
      await toggleTodoCompleted(id);
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this todo?")) {
      setDeletingId(id);
      startTransition(async () => {
        await deleteTodo(id);
        setDeletingId(null);
      });
    }
  };

  if (todos.length === 0) {
    return (
      <Box py="12" textAlign="center">
        <Text fontSize="lg" color="fg.subtle">
          No todos yet. Create your first todo above!
        </Text>
      </Box>
    );
  }

  return (
    <VStack gap="4" align="stretch">
      {todos.map((todo) => (
        <Box
          key={todo.id}
          {...surfaceBoxProps}
          p="4"
          opacity={deletingId === todo.id ? 0.5 : 1}
          transition="opacity 0.2s ease"
        >
          <HStack align="start" gap="4">
            <Checkbox.Root
              checked={todo.completed}
              disabled={isPending}
              mt="1"
              aria-label={`Toggle completion for ${todo.title}`}
              onCheckedChange={() => handleToggle(todo.id)}
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
            </Checkbox.Root>
            <Box flex="1">
              <ChakraLink asChild _hover={{ textDecoration: "none" }}>
                <NextLink href={`/todos/${todo.id}`}>
                  <Text
                    as="h3"
                    fontSize="lg"
                    fontWeight="semibold"
                    color={todo.completed ? "fg.subtle" : "fg"}
                    textDecoration={todo.completed ? "line-through" : "none"}
                    _hover={{ color: "fg.brand" }}
                  >
                    {todo.title}
                  </Text>
                </NextLink>
              </ChakraLink>
              {todo.description && (
                <Text mt="1" color="fg.muted">
                  {todo.description}
                </Text>
              )}
              <Text mt="2" {...helperTextProps}>
                Created {format(new Date(todo.createdAt), "MMM d, yyyy")}
              </Text>
            </Box>
            <HStack gap="2">
              <ChakraLink asChild>
                <NextLink href={`/todos/${todo.id}`}>
                  <Button as="span" variant="outline" size="sm">
                    Edit
                  </Button>
                </NextLink>
              </ChakraLink>
              <Button
                onClick={() => handleDelete(todo.id)}
                disabled={isPending || deletingId === todo.id}
                variant="outline"
                colorPalette="red"
                size="sm"
              >
                Delete
              </Button>
            </HStack>
          </HStack>
        </Box>
      ))}
    </VStack>
  );
}
