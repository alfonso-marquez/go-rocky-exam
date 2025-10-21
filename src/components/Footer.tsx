import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex items-center">
      <div className="container mx-auto py-10 border-t">
        <div className="flex items-center justify-center gap-2">
          <p className="text-md text-black">&copy; 2025</p>
          <Link
            className="text-md"
            target="_blank"
            href="https://alfonso-marquez-portfolio.vercel.app/"
          >
            Alfonso Marquez
          </Link>
        </div>
      </div>
    </footer>
  );
}
