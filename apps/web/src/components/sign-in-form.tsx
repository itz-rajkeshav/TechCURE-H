import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";

import Loader from "./loader";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function SignInForm({ onSwitchToSignUp }: { onSwitchToSignUp: () => void }) {
  const navigate = useNavigate({
    from: "/",
  });
  const { isPending } = authClient.useSession();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: () => {
            navigate({
              to: "/dashboard",
            });
            toast.success("Sign in successful");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        },
      );
    },
    validators: {
      onSubmit: z.object({
        email: z.email("Invalid email address"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    },
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <div className="flex min-h-[50vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-xl border shadow-sm">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome Back</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to continue to your dashboard
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="mt-8 space-y-6"
        >
          <div className="space-y-4">
            <div>
              <form.Field name="email">
                {(field) => (
                  <div className="space-y-2">
                    <Label htmlFor={field.name}>Email address</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="email"
                      placeholder="name@example.com"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="h-11"
                    />
                    {field.state.meta.errors.map((error) => (
                      <p key={error?.message} className="text-sm font-medium text-destructive">
                        {error?.message}
                      </p>
                    ))}
                  </div>
                )}
              </form.Field>
            </div>

            <div>
              <form.Field name="password">
                {(field) => (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={field.name}>Password</Label>
                      <Button variant="link" className="px-0 font-normal h-auto text-xs text-muted-foreground" type="button">
                        Forgot password?
                      </Button>
                    </div>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="h-11"
                    />
                    {field.state.meta.errors.map((error) => (
                      <p key={error?.message} className="text-sm font-medium text-destructive">
                        {error?.message}
                      </p>
                    ))}
                  </div>
                )}
              </form.Field>
            </div>
          </div>

          <form.Subscribe>
            {(state) => (
              <Button
                type="submit"
                className="w-full h-11 text-base font-medium"
                disabled={!state.canSubmit || state.isSubmitting}
              >
                {state.isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            )}
          </form.Subscribe>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Button
              variant="link"
              onClick={onSwitchToSignUp}
              className="px-0 font-semibold text-primary hover:text-primary/80 underline-offset-4"
            >
              Sign up
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
