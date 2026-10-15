import { Button, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <p className="display text-8xl text-terra">404</p>
      <p className="mt-4 text-muted">Такой страницы нет. Возможно, ссылка устарела.</p>
      <Button href="/" className="mt-8">На главную</Button>
    </Container>
  );
}
