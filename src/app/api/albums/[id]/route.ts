import { NextResponse } from "next/server";
import { getAlbum } from "@/lib/albums";

interface Params {
  params: { id: string };
}

const GET = async ({ params }: Params) => {
  try {
    if (!params?.id) {
      return NextResponse.json(
        { error: "Album ID is required" },
        { status: 400 },
      );
    }
    const album = await getAlbum(Number(params.id)); // ✅ uses lib helper

    return NextResponse.json(album, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};

export { GET };
