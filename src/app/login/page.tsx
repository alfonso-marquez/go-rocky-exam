import { Label } from "@/components/ui/label";
import { login } from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AccountLayout from "@/components/layouts/Account/AccountLayout";

export default function LoginPage() {
  return (
    <AccountLayout
      heading="Login"
      footerText="Need an account?"
      footerLinkText="Register"
      footerLinkUrl="/register"
    >
      <div className="flex w-full flex-col gap-2">
        <Label>Email</Label>
        <Input type="email" name="email" placeholder="Email" required />
      </div>

      <div className="flex w-full flex-col gap-2">
        <Label>Password</Label>
        <Input
          type="password"
          name="password"
          placeholder="Password"
          required
        />
      </div>

      <Button type="submit" formAction={login} className="w-full mt-2">
        Login
      </Button>

      <div className="flex w-full flex-col gap-2">
        <a
          className="text-sm place-self-center hover:underline"
          href="/auth/forgetPassword"
        >
          Forgot Password?
        </a>
      </div>
    </AccountLayout>
    // <form>
    //     <label htmlFor="email">Email:</label>
    //     <input id="email" name="email" type="email" required />
    //     <label htmlFor="password">Password:</label>
    //     <input id="password" name="password" type="password" required />
    //     <button formAction={login}>Log in</button>
    //     <button formAction={signup}>Sign up</button>
    // </form>
  );
}
