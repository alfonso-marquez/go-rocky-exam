import { getAlbums } from "@/lib/albums";
import { NextResponse } from "next/server";

const GET = async () => {
  try {
    const albums = await getAlbums(); // uses lib helper
    return NextResponse.json(albums, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};

export { GET };
