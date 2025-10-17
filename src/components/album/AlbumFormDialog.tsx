"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react";

export default function AlbumFormDialog() {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCreate = async () => {
        if (!name.trim()) return alert("Album name required");
        setLoading(true);

        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        const { error } = await supabase.from("albums").insert({
            name,
            description,
            user_id: user?.id,
        });

        if (error) {
            console.error("Create failed:", error);
            alert("Error creating album");
        } else {
            setName("");
            setDescription("");
        }

        setLoading(false);
    };

    return (

        <Dialog>
            <DialogTrigger asChild ><Button variant="outline">
                <Plus />
            </Button></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Album</DialogTitle>
                    <DialogDescription>
                        Add a new album to organize your photos.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreate}>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="album-name">Name</Label>
                            <Input
                                id="album-name"
                                placeholder="My Album"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                placeholder="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <Button type="submit" disabled={loading} className="mt-4">
                            {loading ? <span>Loading...</span> : <span>Submit</span>}
                        </Button>
                    </div>
                </form>

            </DialogContent>
        </Dialog>

    );

}
