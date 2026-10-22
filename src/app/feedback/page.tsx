import type { Metadata } from "next";
import { FeedbackForm } from "@/components/feedback-form";
import { Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Отзыв" };

export default function FeedbackPage() {
  return (
    <>
      <PageHeader
        title="Отзыв"
        lead="Поделитесь, что было для вас важным и что можно сделать лучше. Отзывы помогают нам готовить следующие встречи."
      />
      <Container className="max-w-2xl py-6 lg:py-10">
        <FeedbackForm />
      </Container>
    </>
  );
}
