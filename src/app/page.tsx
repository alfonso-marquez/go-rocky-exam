import HeroPhoto from "@/components/photo/HeroPhoto";
import PhotoList from "@/components/photo/PhotoList";

// public home
export default async function Home() {
  return (
    <>
      <div className="font-sans items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 max-w-7xl mx-auto">
        <HeroPhoto />
        <PhotoList />
      </div>
    </>
  );
}
