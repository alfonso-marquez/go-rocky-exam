import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import AlbumFormDialog from "@/components/album/AlbumFormDialog";
import AlbumList from "@/components/album/AlbumList";

import { Card, CardContent } from "@/components/ui/card";
import TagFormDialog from "@/components/tag/TagFormDialog";

export default async function Albums() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/login");
  }
  return (
    <>
      <div className="flex flex-col items-center  p-8 pb-20 gap-16 sm:p-20 max-w-7xl mx-auto">
        <div className="mx-auto my-30 w-full max-w-6xl">
          <Card>
            <div className="flex items-center justify-center px-10 gap-4">
              <h1 className="text-2xl md:text-3xl font-semibold md:mb-2">
                My Albums
              </h1>
              <div className="flex gap-2 ml-auto">
                <TagFormDialog />
                <AlbumFormDialog />
              </div>
            </div>
            <CardContent>
              <AlbumList />
            </CardContent>
          </Card>
        </div>
      </div>

    </>
  );
}
