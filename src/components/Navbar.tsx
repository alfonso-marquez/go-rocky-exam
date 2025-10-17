"use client";

import * as React from "react";
import Link from "next/link";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { createClient } from "@/utils/supabase/client";
import { Button } from "./ui/button";
import { redirect } from "next/navigation";

type NavbarProps = {
  user: {
    first_name: string;
    last_name: string;
  } | null;
};

export function Navbar({ user }: NavbarProps) {
  const supabase = createClient();

  const redirectToLogin = async () => {
    await supabase.auth.signOut();
    redirect("/login");
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-background/90 backdrop-blur-sm shadow-md px-2 sm:px-4">
      <div className="max-w-7xl mx-auto py-3 flex justify-between items-center">
        <div className="text-md font-bold hidden lg:block"> Portfolio</div>
        <NavigationMenu viewport={false}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link href="/">Home</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            {user && (
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href="/albums">Albums</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
            {user ? (
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  {user.first_name} {user.last_name}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[200px] gap-4">
                    <li>
                      <NavigationMenuLink asChild>
                        <Link href="my-profile">My Profile</Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Button
                          variant="ghost"
                          className="cursor-pointer hover:bg-accent hover:text-accent-foreground focus:bg-accent"
                          onClick={redirectToLogin}
                        >
                          Logout
                        </Button>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ) : (
              <NavigationMenuItem>
                <Button
                  variant="ghost"
                  className="cursor-pointer hover:bg-accent hover:text-accent-foreground focus:bg-accent"
                  onClick={redirectToLogin}
                >
                  Login
                </Button>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}
