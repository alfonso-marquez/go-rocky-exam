import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }

  const profileId = data?.user?.id;
  const profile = await supabase
    .from("profiles")
    .select("*")
    .eq("id", profileId)
    .single();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-8 text-center">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-2xl font-semibold mt-4">
            {profile.data.first_name} {profile.data.last_name}
          </h1>
          <p className="text-gray-500">{profile.data.email}</p>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-500">
            User ID:{" "}
            <span className="font-medium text-gray-700">
              {profile.data.id || "N/A"}
            </span>
          </p>
        </div>

        <Button className="mt-6 w-full " disabled>
          Edit Profile
        </Button>
      </div>
    </div>
  );
}
