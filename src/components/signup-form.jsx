'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { toast } from "sonner"
import { FaGoogle } from "react-icons/fa";

export function SignupForm({ ...props }) {
  const router = useRouter();

  // submit handler
  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userData = Object.fromEntries(formData.entries());

    // This will now log your actual values!
    // console.log(userData);
    // sign up with email
    const { data, error } = await authClient.signUp.email({
      email: userData.email,
      password: userData.password,
      name: userData.name,
      image: userData.image, // Maps to name="image" below
    })

    if (data) {
      toast.success("Account created successfully!");
      router.push("/login");
    }
    if (error) {
      toast.error(error.message);
    }
  }

  // google login
  const handleGoogleLogin = async () => {
    const data = await authClient.signIn.social({
      provider: "google",
    });
    if (data) {
      toast.success("Logged in successfully!");
      router.push("/");
    }
    if (error) {
      toast.error(error.message);
    }
  };

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit}>
          <FieldGroup>

            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              {/* Added name="name" */}
              <Input id="name" name="name" type="text" placeholder="John Doe" required />
            </Field>

            <Field>
              <FieldLabel htmlFor="image">Image url</FieldLabel>
              {/* Fixed id to "image" and added name="image" */}
              <Input id="image" name="image" type="text" placeholder="Profile Image Url" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              {/* Added name="email" */}
              <Input id="email" name="email" type="email" placeholder="m@example.com" required />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
                // RegEx checking for: 1 uppercase, 1 lowercase, and minimum 6 characters
                pattern="(?=.*[a-z])(?=.*[A-Z]).{6,}"
                title="Must be at least 6 characters long and include both uppercase and lowercase letters."
              />
              <FieldDescription>
                Length must be at least 6 characters, with an uppercase letter and a lowercase letter.
              </FieldDescription>
            </Field>

            <FieldGroup>
              <Field>
                <Button type="submit">Create Account</Button>
                <Button onClick={handleGoogleLogin} variant="outline" type="button">
                  <FaGoogle className="mr-2" />
                  Sign up with Google
                </Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <Link href="/login">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
