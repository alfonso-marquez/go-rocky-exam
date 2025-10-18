"use client";

import { useState } from "react";
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
import { PencilIcon } from "lucide-react";
import { Photo, Tag } from "./types";
import { TagMultiSelect } from "../tag/TagMultiSelect";
import { createClient } from "@/utils/supabase/client";
interface EditPhotoProps {
  photo: Photo;
  setPhotos: React.Dispatch<React.SetStateAction<Photo[]>>;
  tags: Tag[];
}

export default function EditFormDialog({
  photo,
  setPhotos,
  tags,
}: EditPhotoProps) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const formSchema = z.object({
    name: z.string().min(1, "Name must be at least 1 character."),
    description: z
      .string()
      .max(500, "Description must be at most 500 characters."),
    tags: z.array(z.string()).optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: photo.title || "",
      description: photo.description || "",
      // tags: photo.photo_tags?.map((t) => t.tags.name) || [],
      tags: photo.photo_tags?.map((t) => t.tags?.name).filter(Boolean) || [],
    },
    shouldFocusError: false,
    mode: "onSubmit",
    shouldUnregister: false,
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("User not found");

      // 1️⃣ Update the photo
      const { data: updatedPhoto, error: photoError } = await supabase
        .from("photos")
        .update({
          title: values.name,
          description: values.description,
        })
        .eq("id", photo.id)
        .select()
        .single();

      if (photoError) throw photoError;

      // 2️⃣ Check existing tags
      const { data: existingTags } = await supabase
        .from("tags")
        .select("id, name")
        .in("name", values.tags || []);

      const existingTagNames = existingTags?.map((t) => t.name) || [];
      const newTags =
        values.tags?.filter((t) => !existingTagNames.includes(t)) || [];

      // 3️⃣ Insert new tags if needed
      if (newTags.length > 0) {
        await supabase.from("tags").insert(newTags.map((name) => ({ name })));
      }

      // 4️⃣ Get all tag IDs for the selected tags
      const { data: allTags } = await supabase
        .from("tags")
        .select("id, name")
        .in("name", values.tags || []);

      // 5️⃣ Clear old relations
      await supabase.from("photo_tags").delete().eq("photo_id", photo.id);

      // 6️⃣ Link new tags
      const tagLinks = allTags?.map((t) => ({
        photo_id: photo.id,
        tag_id: t.id,
      }));

      await supabase.from("photo_tags").insert(tagLinks);

      // 7️⃣ Update state locally
      setPhotos((prev) =>
        prev.map((p) =>
          p.id === updatedPhoto.id
            ? { ...updatedPhoto, photo_tags: allTags }
            : p,
        ),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <PencilIcon
          size={30}
          className="absolute top-2 right-2 bg-white/90 text-slate-800 text-sm px-2 py-1 rounded-md shadow cursor-pointer"
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Photo</DialogTitle>
          <DialogDescription>
            Edit photo details and save changes.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            {/* Photo name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="name" />
                  </FormControl>
                  <FormDescription>Photo name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
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
                    Describe your photo in a few words.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tags */}
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <TagMultiSelect
                      options={tags}
                      selected={field.value || []}
                      onChange={(newTags) => field.onChange(newTags)}
                      placeholder="Select tags..."
                    />
                  </FormControl>
                  <FormDescription>
                    Select tags related to your photo
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading} className="mt-4">
              {loading ? "Saving..." : "Submit"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
