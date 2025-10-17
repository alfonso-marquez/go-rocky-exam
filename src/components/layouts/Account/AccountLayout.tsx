import { AccountLayoutProps } from "@/types/auth";
import Image from "next/image";

export default function AccountLayout({
  heading,
  logo = {
    url: "/",
    src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-wordmark.svg",
    alt: "logo",
    title: "shadcnblocks.com",
  },
  children,
  footerText,
  footerLinkText,
  footerLinkUrl,
}: AccountLayoutProps) {
  return (
    <section className="bg-muted h-screen">
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-6 lg:justify-start">
          {/* Logo */}
          <a href={logo.url}>
            <Image
              src={logo.src}
              alt={logo.alt}
              title={logo.title}
              className="h-10 dark:invert"
            />
          </a>

          <div className="min-w-sm border-muted bg-background flex w-full max-w-sm flex-col items-center gap-y-4 rounded-md border px-6 py-8 shadow-md">
            <h1 className="text-xl font-semibold">{heading}</h1>

            {/* Form fields passed here */}
            <form className="w-full flex flex-col gap-2">{children}</form>
          </div>

          {footerText && footerLinkText && footerLinkUrl && (
            <div className="text-muted-foreground flex justify-center gap-1 text-sm">
              <p>{footerText}</p>
              <a
                href={footerLinkUrl}
                className="text-primary font-medium hover:underline"
              >
                {footerLinkText}
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
