import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Eye, EyeOff, Key, Save } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUpdatePassword } from "@/hooks/useAuth";

const updatePasswordSchema = z
  .object({
    old_password: z.string().min(6, "Current password is required"),
    new_password: z
      .string()
      .min(6, "New password must be at least 6 characters"),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;

export default function UpdatePassword() {
  const navigate = useNavigate();
  const [showPasswords, setShowPasswords] = useState(false);
  const { mutate: updatePassword, isPending } = useUpdatePassword();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
  });

  const onSubmit = (data: UpdatePasswordFormData) => {
    updatePassword(
      {
        old_password: data.old_password,
        new_password: data.new_password,
      },
      {
        onSuccess: () => {
          reset();
          navigate("/profile");
        },
      },
    );
  };

  return (
    <>
      <Helmet>
        <title>Change Password - SkyCart</title>
      </Helmet>

      <div className="max-w-xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/profile")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="old_password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="old_password"
                    type={showPasswords ? "text" : "password"}
                    placeholder="Enter current password"
                    {...register("old_password")}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPasswords(!showPasswords)}
                  >
                    {showPasswords ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.old_password && (
                  <p className="text-sm text-destructive">
                    {errors.old_password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="new_password">New Password</Label>
                <Input
                  id="new_password"
                  type={showPasswords ? "text" : "password"}
                  placeholder="Enter new password"
                  {...register("new_password")}
                />
                {errors.new_password && (
                  <p className="text-sm text-destructive">
                    {errors.new_password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm_password">Confirm New Password</Label>
                <Input
                  id="confirm_password"
                  type={showPasswords ? "text" : "password"}
                  placeholder="Confirm new password"
                  {...register("confirm_password")}
                />
                {errors.confirm_password && (
                  <p className="text-sm text-destructive">
                    {errors.confirm_password.message}
                  </p>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1" disabled={isPending}>
                  {isPending ? (
                    "Updating..."
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Update Password
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/profile")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
