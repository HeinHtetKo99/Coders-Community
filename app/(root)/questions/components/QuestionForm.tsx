"use client";
import Button from "@/components/Button";
import Input from "@/components/Input";
import RemoveTag from "@/components/RemoveTag";
import TextEditor from "@/components/TextEditor";
import { Iquestion } from "@/database/Question.model";
import { questionCreate } from "@/lib/actions/questionCreate.action";
import { questionUpdate } from "@/lib/actions/questionUpdate.action";
import Routes from "@/routes";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast, Bounce } from "react-toastify";

function QuestionForm({
  question,
  isEdit = false,
}: {
  question?: Iquestion;
  isEdit?: boolean;
}) {
  const [content, setContent] = useState(question?.content ?? "");
  const [title, setTitle] = useState(question?.title ?? "");
  const [errors, setErrors] = useState<{
    title: string;
    content: string;
    tags: string;
  }>({
    title: "",
    content: "",
    tags: "",
  });
  const [tags, setTags] = useState<string[]>(
    Array.isArray(question?.tags)
      ? question.tags.map((t) =>
          typeof t === "object" && t !== null && "name" in t
            ? String((t as { name: unknown }).name).toLowerCase()
            : String(t).toLowerCase()
        )
      : []
  );
  const [newTags, setNewTags] = useState("");
  const [error, setError] = useState("");
  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const normalizedTag = newTags.trim().toLowerCase();
      if (normalizedTag === "") return;
      if (tags.some((t) => t.toLowerCase() === normalizedTag)) {
        setError("Tag already exists");
        return;
      }
      setTags([...tags, normalizedTag]);
      setNewTags("");
      setError("");
    }
  };
  const router = useRouter();
  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({
      title: "",
      content: "",
      tags: "",
    });
    try {
      if (isEdit && question) {
        const result = await questionUpdate({
          questionId: question._id as string,
          title,
          content,
          tags,
        });
        if (!result.success) {
          const details = result.details as
            | Partial<Record<"title" | "content" | "tags", string[]>>
            | undefined;

          if (details) {
            setErrors({
              title: details.title?.[0] || "",
              content: details.content?.[0] || "",
              tags: details.tags?.[0] || "",
            });
          } else {
            toast.error(result.message || "Something went wrong", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: false,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "colored",
              transition: Bounce,
            });
          }
          return;
        }

        if (result.data) {
          toast.success("Question updated successfully", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          });
          router.push(Routes.question_details(result.data._id));
        }
        return;
      }
      const result = await questionCreate({
        title,
        content,
        tags,
      });
      if (!result.success) {
        const details = result.details as
          | Partial<Record<"title" | "content" | "tags", string[]>>
          | undefined;

        if (details) {
          setErrors({
            title: details.title?.[0] || "",
            content: details.content?.[0] || "",
            tags: details.tags?.[0] || "",
          });
        } else {
          toast.error(result.message || "Something went wrong", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
          });
        }
        return;
      }

      if (result.data) {
        toast.success("Question created successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
        router.push(Routes.question_details(result.data._id));
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
    }
  };
  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };
  return (
    <div className="flex flex-col gap-4 py-4 max-w-4xl mx-auto w-full px-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Ask A New Question
        </h1>
        <p className="text-gray-400 text-sm">
          Share your knowledge and get help from the community
        </p>
      </div>

      <form
        onSubmit={submit}
        className="flex flex-col gap-4 p-5 bg-primary/40 rounded-2xl border border-white/5"
      >
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          label="Title"
          placeholder="Enter a clear and descriptive title for your question"
          className="bg-secondary border-white/10 text-white placeholder:text-gray-500"
        />
        {errors.title && (
          <p className="text-red-500 text-sm font-medium">{errors.title}</p>
        )}

        <div className="flex flex-col gap-2">
          <label className="text-gray-300 text-sm font-medium">
            Any questions?
          </label>
          <TextEditor value={content} onChange={(v) => setContent(v)} />
          {errors.content && (
            <p className="text-red-500 text-sm font-medium">{errors.content}</p>
          )}
        </div>
        <Input
          value={newTags}
          onKeyDown={handleEnter}
          onChange={(e) => setNewTags(e.target.value)}
          label="Tags"
          placeholder="Enter relevant tags (e.g., react, javascript, typescript)"
          className="bg-secondary border-white/10 text-white placeholder:text-gray-500"
        />
        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
        {errors.tags && (
          <p className="text-red-500 text-sm font-medium">{errors.tags}</p>
        )}
        <div className="flex gap-2">
          {tags.map((tag, i) => (
            <RemoveTag key={i} onRemove={() => removeTag(tag)}>
              {tag}
            </RemoveTag>
          ))}
        </div>
        <Button className="w-full mt-4 py-3 font-semibold" type="submit">
          {isEdit ? "Update Question" : "Submit Question"}
        </Button>
      </form>
    </div>
  );
}

export default QuestionForm;
