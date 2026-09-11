import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 py-8">
      <SignUp fallbackRedirectUrl="/onboarding" forceRedirectUrl="/onboarding" />
    </div>
  );
}
