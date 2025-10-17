import { NextRequest, NextResponse } from "next/server";
import { getAlbum } from "@/lib/albums";

// const GET = async (
//   request: NextRequest,
//   context: { params: { id: string } },
// ) => {
//   const { id } = context.params;
//   try {
//     if (!id) {
//       return NextResponse.json(
//         { error: "Album ID is required" },
//         { status: 400 },
//       );
//     }
//     const album = await getAlbum(Number(id)); // uses lib helper

//     return NextResponse.json(album, { status: 200 });
//   } catch (error) {
//     return NextResponse.json(
//       { error: error instanceof Error ? error.message : "Unknown error" },
//       { status: 500 },
//     );
//   }
// };
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const GET = async (request: NextRequest, context: any) => {
  const { id } = context.params; // at runtime this is just { id: string }

  try {
    if (!id) {
      return NextResponse.json(
        { error: "Album ID is required" },
        { status: 400 },
      );
    }

    const album = await getAlbum(Number(id));
    return NextResponse.json(album, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
};

export { GET };
