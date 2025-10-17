'use client';

import { getAlbum, Album, getAlbums } from '@/lib/albums';
import { useEffect, useState } from 'react';

// export default function AlbumPreview({ albumId }: { albumId: string }) {
export default function AlbumPreview({ initialAlbum, albumId }: any) {

    const [album, setAlbum] = useState(initialAlbum);

    return (
        <div>
            <p>todo: show all photos from this album</p>
        </div>

    )
}