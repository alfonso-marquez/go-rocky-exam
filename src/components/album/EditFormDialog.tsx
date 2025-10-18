"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { Album } from "./types";

interface EditAlbumProps {
  album: Album;
  setAlbums: React.Dispatch<React.SetStateAction<Album[]>>;
}

export default function EditFormDialog({ album, setAlbums }: EditAlbumProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const formSchema = z.object({
    name: z.string().min(1, "Name must be at least 1 character."),
    description: z
      .string()
      .max(500, "Description must be at most 500 characters."),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: album.name || "",
      description: album.description || "",
    },
    shouldFocusError: false, // Disable automatic focus on error
    mode: "onSubmit", // avoids premature validation
    shouldUnregister: false, // keep values after unmount
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("User not found");

      const { data, error } = await supabase
        .from("albums")
        .upsert(
          {
            id: album.id, // include if editing
            name: values.name,
            description: values.description ?? "",
            user_id: user.id,
          },
          { onConflict: "id" }, // update if same id exists
        )
        .select()
        .single();

      if (error) throw error;

      // Update state
      if (album.id) {
        // Editing existing
        setAlbums((prev) =>
          prev.map((a) =>
            a.id === data.id
              ? {
                  ...a,
                  name: data.name,
                  description: data.description,
                  // leave a.photos as-is to prevent cover change
                  photos: a.photos,
                }
              : a,
          ),
        );
      } else {
        // Adding new
        setAlbums((prev) => [...prev, data]);
      }
    } catch (error) {
      console.error(error instanceof Error ? error.message : "Unknown error");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Pencil />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Album</DialogTitle>
          <DialogDescription>
            Edit album details and save changes.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="name" />
                  </FormControl>
                  <FormDescription>Album name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Describe your album in a few words.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading} className="mt-4">
              {loading ? <span>Loading...</span> : <span>Submit</span>}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
