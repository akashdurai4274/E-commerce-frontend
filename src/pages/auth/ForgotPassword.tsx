import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForgotPassword } from "@/hooks/useAuth";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const { mutate: forgotPassword, isPending, isSuccess } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPassword(data.email);
  };

  return (
    <>
      <Helmet>
        <title>Forgot Password - SkyCart</title>
      </Helmet>

      <div className="flex items-center justify-center min-h-[calc(100vh-16rem)]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Forgot Password</CardTitle>
            <CardDescription>
              Enter your email and we'll send you a reset link
            </CardDescription>
          </CardHeader>

          {isSuccess ? (
            <CardContent className="text-center py-8">
              <Mail className="h-16 w-16 mx-auto text-primary mb-4" />
              <h3 className="text-lg font-medium mb-2">Check your email</h3>
              <p className="text-muted-foreground mb-4">
                We've sent a password reset link to your email address.
              </p>
              <Link to="/login">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Button>
              </Link>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex flex-col gap-4">
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Sending..." : "Send Reset Link"}
                </Button>
                <Link
                  to="/login"
                  className="text-sm text-center text-muted-foreground hover:text-primary"
                >
                  <ArrowLeft className="h-4 w-4 inline mr-1" />
                  Back to Login
                </Link>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </>
  );
}
