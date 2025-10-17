"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

export default function UploadPhoto({ albumId }: { albumId: string }) {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("albumId", albumId.toString());

        const res = await fetch("/api/photos", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        setIsUploading(false);

        if (!res.ok) alert(data.error || "Upload failed");
        else alert("Upload successful!");
    };

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="grid w-full max-w-sm items-center gap-3 p-5">
                <Label htmlFor="picture">Picture</Label>
                <Input id="picture" type="file" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </div>
            <Button
                onClick={handleUpload}
                disabled={isUploading || !file}
                variant="default"
            >
                {isUploading ? "Uploading..." : "Upload"}
            </Button>
        </div>
    );
}
