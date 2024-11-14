import { resetPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function ResetPassword(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  return (
    <div className="container relative hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          SWM
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Smart waste management leverages technology to optimize the
              collection, transportation, and disposal of waste. By using data
              analytics, IoT devices, and automation, it aims to reduce
              environmental impact, improve efficiency, and create a cleaner,
              more sustainable future for communities.&rdquo;
            </p>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Reset password
            </h1>
            <p className="text-sm text-muted-foreground">
              Please enter your new password below.
            </p>
          </div>
          <div className="grid gap-6">
            <form className="flex-1 flex flex-col min-w-64">
              <div className="flex flex-col gap-2 [&>input]:mb-3 mt-8">
                <Label htmlFor="password">New password</Label>
                <Input
                  type="password"
                  name="password"
                  placeholder="New password"
                  required
                />
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm password"
                  required
                />
                <SubmitButton formAction={resetPasswordAction}>
                  Reset password
                </SubmitButton>
                <FormMessage message={searchParams} />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}