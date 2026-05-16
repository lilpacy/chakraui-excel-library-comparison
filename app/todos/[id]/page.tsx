import { auth } from "@clerk/nextjs/server";
import { Box, Container, Text } from "@chakra-ui/react";
import { redirect } from "next/navigation";
import { getTodoById } from "@/app/actions/todos";
import { EditTodoForm } from "./EditTodoForm";

export const metadata = {
  title: "Edit Todo",
  description: "Edit your todo",
};

export default async function EditTodoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  const { id } = await params;

  if (!userId) {
    redirect("/sign-in");
  }

  try {
    const todo = await getTodoById(id);

    return (
      <Container maxW="2xl" px={{ base: 4, md: 6 }} py={{ base: 8, md: 10 }}>
        <Box mb="8">
          <Text as="h1" fontSize="3xl" fontWeight="bold" mb="2">
            Edit Todo
          </Text>
          <Text color="gray.600">Update your todo information</Text>
        </Box>

        <EditTodoForm todo={todo} />
      </Container>
    );
  } catch (error) {
    return (
      <Container maxW="2xl" px={{ base: 4, md: 6 }} py={{ base: 8, md: 10 }}>
        <Box textAlign="center">
          <Text as="h1" fontSize="2xl" fontWeight="bold" color="red.600" mb="4">
            Error
          </Text>
          <Text color="gray.600">
            {error instanceof Error ? error.message : "Todo not found"}
          </Text>
        </Box>
      </Container>
    );
  }
}
