"use client";

import React, { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { signup, login } from "../api";
import { setUser } from "@/store";
import { useDispatch } from "react-redux";
import { Eye, EyeOff } from "lucide-react";

interface SignupDialogProps {
  trigger?: React.ReactNode;
}

const SignupDialog = ({ trigger }: SignupDialogProps) => {
  const dispatch = useDispatch();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [isSignup, setIsSignup] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const clearForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setPhoneNumber("");
    setError("");
  };

  const handleAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      if (isSignup) {
        const data = await signup(
          firstName,
          lastName,
          phoneNumber,
          email,
          password,
        );

        console.log("Signup successful:", data);
        dispatch(setUser(data));
        setOpen(false);
        clearForm();
		
      } else {
        const data = await login(email, password);
        console.log("Login successful:", data);
        dispatch(setUser(data));
        setOpen(false);
        clearForm();
      }
	  
    } catch (error: any) {
      console.error("Authentication error:", error);

      if (isSignup) {
        const message = error?.response?.data?.message;
        setError(message || "Unable to create account. Please try again.");
      } else {
        setError("Invalid email or password.");
      }
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsSignup((previous) => !previous);
    setError("");
  };

  if (!mounted) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);

        if (!value) {
          clearForm();
        }
      }}
    >
      <DialogTrigger
        type="button"
      >
        {trigger ?? "Login / Sign Up"}
      </DialogTrigger>

      <DialogContent className="bg-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-black">
            {isSignup ? "Create Account" : "Welcome Back"}
          </DialogTitle>

          <DialogDescription>
            {isSignup
              ? "Join us to start booking your travels."
              : "Enter your credentials to access your account."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleAuth} className="space-y-4 py-4">
          {isSignup && (
            <div className="grid grid-cols-2 gap-4 text-black">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>

                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>

                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>
          )}

          <div className="space-y-2 text-black">
            <Label htmlFor="email">Email</Label>

            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2 text-black">
            <Label htmlFor="password">Password</Label>

            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              className="pr-10"
              onChange={(event) => setPassword(event.target.value)}
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-6 top-1/2 translate-y-1/4 py-3 px-2"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {isSignup && (
            <div className="space-y-2 text-black">
              <Label htmlFor="phoneNumber">Phone Number</Label>

              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                required
                disabled={loading}
              />
            </div>
          )}

          {error && (
            <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
          >
            {loading ? "Please wait..." : isSignup ? "Sign Up" : "Login"}
          </Button>
        </form>

        <div className="text-center text-sm text-black">
          {isSignup ? (
            <>
              Already have an account?{" "}
              <Button
                type="button"
                variant="link"
                className="p-0 text-blue-600"
                onClick={switchMode}
                disabled={loading}
              >
                Login
              </Button>
            </>
          ) : (
            <>
              Don't have an account?{" "}
              <Button
                type="button"
                variant="link"
                className="p-0 text-blue-600"
                onClick={switchMode}
                disabled={loading}
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignupDialog;
