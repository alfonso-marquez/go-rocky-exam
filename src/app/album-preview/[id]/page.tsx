
import AlbumPreview from '@/components/album/AlbumPreview';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Album, getAlbum } from '@/lib/albums';
import React from 'react';

export default async function AlbumPreviewPage({ params }: { params: Promise<{ id: string }> }) {

    // Handle await params NextJS
    const albumId = (await params).id;
    const album = await getAlbum(Number(albumId));

    return (
        <>
            <div className="font-sans flex flex-col items-center justify-center min-w-[320px] w-full px-4 sm:px-8 lg:px-12 py-10 sm:py-16 gap-10 max-w-7xl mx-auto mt-10">
                <div className="w-full max-w-6xl">
                    <Card className="w-full shadow-md">
                        <CardHeader className="text-center">
                            <h1 className="text-2xl font-bold text-gray-800">{album.name}</h1>
                            <h2 className="text-gray-600 text-base">{album.description}</h2>
                        </CardHeader>
                    </Card>

                    <div className="mt-6">
                        <Card className="w-full min-w-[300px] shadow-sm">
                            <CardContent>
                                <AlbumPreview initialAlbum={album} albumId={albumId} />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

        </>
    );
}