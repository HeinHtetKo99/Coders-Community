"use client";

import React from "react";
import { Bounce, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import NextImage from "next/image";
import { FaCamera } from "react-icons/fa";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { updateUserImage } from "@/lib/actions/getUser.action";

const makeSquareAvatar = async (
  file: File,
  size: number = 256
): Promise<string> => {
  const fileUrl = URL.createObjectURL(file);
  try {
    const img = new window.Image();
    img.decoding = "async";
    img.src = fileUrl;
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Failed to load image"));
    });

    const sourceWidth = img.naturalWidth || img.width;
    const sourceHeight = img.naturalHeight || img.height;
    const side = Math.min(sourceWidth, sourceHeight);
    const sx = Math.floor((sourceWidth - side) / 2);
    const sy = Math.floor((sourceHeight - side) / 2);

    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas is not supported");

    ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
    return canvas.toDataURL("image/jpeg", 0.85);
  } finally {
    URL.revokeObjectURL(fileUrl);
  }
};

export default function ProfileImageEditor(props: { currentImage?: string }) {
  const { currentImage } = props;
  const router = useRouter();

  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = React.useState(false);
  const [pending, setPending] = React.useState(false);
  const [draftImage, setDraftImage] = React.useState<string | null>(null);

  const previewSrc = draftImage || currentImage || "/profile.jpg";

  const onPickFile = async (file: File | null) => {
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Only JPG, PNG or WEBP images are supported.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image is too large (max 5MB).", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
      return;
    }

    try {
      const avatar = await makeSquareAvatar(file, 256);
      setDraftImage(avatar);
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Failed to process the image.",
        {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
          transition: Bounce,
        }
      );
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const save = async () => {
    if (!draftImage) return;
    setPending(true);
    try {
      const res = await updateUserImage({ image: draftImage });
      if (!res.success) {
        throw new Error(res.message || "Failed to update image");
      }
      toast.success("Profile image updated.", {
        position: "top-right",
        autoClose: 2500,
        theme: "colored",
        transition: Bounce,
      });
      setOpen(false);
      setDraftImage(null);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update image.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
    } finally {
      setPending(false);
    }
  };

  const remove = async () => {
    setPending(true);
    try {
      const res = await updateUserImage({ image: "" });
      if (!res.success) {
        throw new Error(res.message || "Failed to remove image");
      }
      toast.success("Profile image removed.", {
        position: "top-right",
        autoClose: 2500,
        theme: "colored",
        transition: Bounce,
      });
      setOpen(false);
      setDraftImage(null);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to remove image.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
    } finally {
      setPending(false);
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) setDraftImage(null);
      }}
    >
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          size="icon-sm"
          className="absolute bottom-1 right-1 rounded-full bg-black/60 text-white hover:bg-black/70 border border-white/15 shadow-sm"
        >
          <FaCamera className="size-3.5" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle>Edit profile image</AlertDialogTitle>
          <AlertDialogDescription>
            Upload a new image. It will be cropped to a square avatar.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] items-center gap-5">
          <div className="mx-auto size-28 overflow-hidden rounded-full border border-white/10 bg-white/5">
            <NextImage
              src={previewSrc}
              alt="Profile preview"
              width={112}
              height={112}
              className="h-full w-full object-cover"
              unoptimized={previewSrc.startsWith("data:")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => onPickFile(e.target.files?.[0] || null)}
              disabled={pending}
            />
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => inputRef.current?.click()}
                disabled={pending}
              >
                Choose image
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={remove}
                disabled={pending}
              >
                Remove
              </Button>
            </div>
            <div className="text-xs text-gray-400">
              JPG / PNG / WEBP, max 5MB.
            </div>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <Button
            type="button"
            disabled={pending || !draftImage}
            onClick={() => void save()}
          >
            Save
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
