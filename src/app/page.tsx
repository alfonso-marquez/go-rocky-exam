import HeroPhoto from "@/components/photo/HeroPhoto";
import PhotoList from "@/components/photo/PhotoList";
import { createClient } from "@/utils/supabase/server";

// public home
export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  return (
    <>
      <div className="items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 max-w-7xl mx-auto">
        <HeroPhoto isAuthenticated={Boolean(user)} />
        <PhotoList />
      </div>
    </>
  );
}
