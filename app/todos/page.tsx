import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { Box, Container, Text, VStack } from "@chakra-ui/react";
import { redirect } from "next/navigation";
import { getTodos } from "@/app/actions/todos";
import { pageTitleProps, sectionDescriptionProps } from "@/app/design-system/patterns";
import { TodoList } from "./components/TodoList";
import { CreateTodoForm } from "./components/CreateTodoForm";

export const metadata = {
  title: "Todos",
  description: "Manage your todos",
};

export default async function TodosPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const todos = await getTodos();

  return (
    <Container maxW="4xl" px={{ base: 4, md: 6 }} py={{ base: 8, md: 10 }}>
      <VStack align="stretch" gap="8">
        <Box>
          <Text as="h1" mb="2" {...pageTitleProps}>
            My Todos
          </Text>
          <Text {...sectionDescriptionProps}>Manage your tasks efficiently</Text>
        </Box>

        <CreateTodoForm />
        <Suspense fallback={<Text>Loading todos...</Text>}>
          <TodoList todos={todos} />
        </Suspense>
      </VStack>
    </Container>
  );
}
