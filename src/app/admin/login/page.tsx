import { LoginForm } from "@/components/admin/LoginForm";

export const metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-2xl border border-line bg-white p-8">
        <h1 className="mb-1 text-2xl font-bold">Admin sign in</h1>
        <p className="mb-6 text-sm text-muted">Property Inspectors CMS</p>
        <LoginForm />
      </div>
    </main>
  );
}
