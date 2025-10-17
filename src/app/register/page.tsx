import { Label } from "@/components/ui/label";
import { signup } from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AccountLayout from "@/components/layouts/Account/AccountLayout";

export default function RegisterPage() {
  return (
    <AccountLayout
      heading="Register"
      footerText="Already have an account?"
      footerLinkText="Login"
      footerLinkUrl="/login"
    >
      <div className="flex w-full flex-col gap-2 my-2">
        <Label>First Name</Label>
        <Input
          type="text"
          name="first_name"
          placeholder="First Name"
          required
        />
      </div>
      <div className="flex w-full flex-col gap-2 my-2">
        <Label>Last Name</Label>
        <Input type="text" name="last_name" placeholder="Last Name" required />
      </div>
      <div className="flex w-full flex-col gap-2 my-2">
        <Label>Email</Label>
        <Input type="email" name="email" placeholder="Email" required />
      </div>

      <div className="flex w-full flex-col gap-2 my-2">
        <Label>Password</Label>
        <Input
          type="password"
          name="password"
          placeholder="Password"
          required
        />
      </div>

      <Button type="submit" formAction={signup} className="w-full mt-2">
        Sign Up
      </Button>
    </AccountLayout>
  );
}
