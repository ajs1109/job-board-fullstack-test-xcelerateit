"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/stores/authStore";
import { LoginInput, UserRole } from "@/types/user";
import { errorToast } from "@/utils/customToast";
import { UserRoundCheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type AuthEvent = FormEvent<HTMLFormElement> & {
  target: HTMLFormElement & {
    elements: {
      username?: HTMLInputElement;
      email: HTMLInputElement;
      password: HTMLInputElement;
    };
  };
};

const AuthForms = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | "">("");
  const { login, isAuthenticated, register } = useAuthStore();
  const router = useRouter();

  const handleLogin = async (e: AuthEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData(e.target);
      await login(
        formData.get("email") as string,
        formData.get("password") as string
      );

      onAuthSuccess();
    } catch (error: any) {
      console.log(error);
      errorToast(error.response.data.message ? error.response.data.message : "Login failed");
    }
  };

  const handleSignup = async (e: AuthEvent) => {
    e.preventDefault();

    if (!selectedRole) {
      errorToast("Please select a role before signing up.");
      return;
    }

    try {
      const formData = new FormData(e.target);
      const registerData: LoginInput = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        role: "employer",
        name: formData.get("username") as string,
      };
      await register(registerData);
      onAuthSuccess();
    } catch (error) {
      errorToast(error instanceof Error ? error.message : "Signup failed");
    }
  };

  const onAuthSuccess = () => {
    router.push("/");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-violet-500/10 to-purple-500/10">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center ">
            <UserRoundCheckIcon className="h-12 w-12 text-violet-500" />
          <CardTitle className="text-2xl font-bold my-auto ml-4">Job Board</CardTitle>
          </div>
          <CardDescription>
            Welcome to the Job Board! Please login or sign up to continue.
          </CardDescription>
        </CardHeader>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email or Username</Label>
                    <Input
                      id="login-email"
                      name="email"
                      type="text"
                      placeholder="Enter Email / Username"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      name="password"
                      type="password"
                      required
                    />
                  </div>
                </div>
                <CardFooter className="flex justify-end mt-4 px-0">
                  <Button
                    type="submit"
                    className="bg-violet-500 hover:bg-violet-600"
                  >
                    Login
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </TabsContent>

          <TabsContent value="signup">
            <CardContent>
              <form onSubmit={handleSignup}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="block">I am a/an:</Label>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        className={`px-4 py-2 rounded-md border transition w-full cursor-pointer ${
                          selectedRole === "employer"
                            ? "bg-violet-500 text-white border-violet-500"
                            : "bg-white text-gray-700 border-gray-300"
                        }`}
                        onClick={() => setSelectedRole("employer")}
                      >
                        Employer
                      </button>
                      <button
                        type="button"
                        className={`px-4 py-2 rounded-md border transition w-full cursor-pointer ${
                          selectedRole === "job_seeker"
                            ? "bg-violet-500 text-white border-violet-500"
                            : "bg-white text-gray-700 border-gray-300"
                        }`}
                        onClick={() => setSelectedRole("job_seeker")}
                      >
                        Job Seeker
                      </button>
                    </div>
                    {/* Hidden input to send with form */}
                    <input
                      type="hidden"
                      name="role"
                      value={selectedRole}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-username">Username</Label>
                    <Input
                      id="signup-username"
                      name="username"
                      type="text"
                      placeholder="speedtyper123"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      name="password"
                      type="password"
                      required
                    />
                  </div>
                </div>
                <CardFooter className="flex justify-end mt-4 px-0">
                  <Button
                    type="submit"
                    className="bg-violet-500 hover:bg-violet-600"
                  >
                    Sign Up
                  </Button>
                </CardFooter>
              </form>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default AuthForms;
