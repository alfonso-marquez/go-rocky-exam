"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { toast } from "sonner";
import { Photo } from "./types";

// Zod Schema for Validation
const noFutureDateString = z
  .string()
  .refine((val) => new Date(val) <= new Date(), {
    message: "Date cannot be in the future",
  });

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  description: z.string().optional(),
  // camera_brand: z.string().optional(),
  // photo_category: z.string().optional(),
  details: z.string().optional(),
  location: z.string().optional(),
  taken_at: noFutureDateString.optional(),
  url: z
    .any()
    .refine((file) => file instanceof File, {
      message: "An image file is required",
    })
    .refine((file) => file?.type?.startsWith("image/"), {
      message: "Only image files are allowed (jpg, png)",
    })
    .refine((file) => file?.size <= 20 * 1024 * 1024, {
      message: "File size must be less than or equal to 20MB",
    }),
});

export default function AddPhotoDialog({
  albumId,
  onPhotoAdded,
}: {
  albumId: string;
  onPhotoAdded?: (photo: Photo) => void; // change type
}) {
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      url: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!file) return;
    setIsUploading(true);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description ?? "");
      formData.append("albumId", albumId.toString());
      formData.append("file", file);

      const res = await fetch("/api/photos", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      // Add new photo to album list immediately
      if (data?.photo) {
        onPhotoAdded?.(data.photo); // This now works
      }

      setOpen(false);
      form.reset();

      toast.success("Success!", {
        description: "Your photo has been uploaded successfully.",
      });
      // const data = await res.json();
      // if (!res.ok) alert(data.error || "Upload failed");
      // else alert("Upload successful!");
    } catch (error) {
      toast.error("Error!", {
        description:
          error instanceof Error ? error.message : "Something went wrong.",
      });
    } finally {
      setIsUploading(false);
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-y-auto max-h-screen">
        <DialogHeader>
          <DialogTitle>Create Photo</DialogTitle>
          <DialogDescription>
            Create and upload a new photo and add it to the list.
          </DialogDescription>
        </DialogHeader>

        {/* Display API Error (if any) */}
        {/* {apiError && (
          <div className="text-red-500 font-semibold text-sm mb-4">
            {apiError}
          </div>
        )}
        {preview && (
          <img
            src={preview.startsWith("blob:") ? preview : getPhotoUrl(preview)}
            className="mt-2 w-full max-h-100 object-cover rounded-md"
          />
        )} */}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Title of uploaded photo (must be at least 5 characters).
                  </FormDescription>
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
                    <Textarea {...field} />
                  </FormControl>
                  <FormDescription>
                    Description of uploaded photo.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={() => (
                <FormItem>
                  <FormLabel>Upload Photo</FormLabel>
                  <FormControl>
                    <Input
                      id="picture"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        setFile(file ?? null);

                        // ✅ update react-hook-form value and trigger validation
                        form.setValue("url", file ?? null, {
                          shouldValidate: true,
                        });
                      }}
                    />
                  </FormControl>
                  <FormDescription>Upload a photo (max 20MB)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isUploading || !file}
              className="mt-4"
            >
              {isUploading ? (
                <span>Uploading...</span>
              ) : loading ? (
                <span>Loading...</span>
              ) : (
                <span>Upload</span>
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
