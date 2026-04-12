"use client";

import { useEditor, EditorContent, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "highlight.js/styles/github.css";
import { Markdown } from "tiptap-markdown";
import {
  FaBold,
  FaCode,
  FaItalic,
  FaLink,
  FaListOl,
  FaListUl,
} from "react-icons/fa";
import { useCallback, useEffect, useMemo } from "react";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import { all, createLowlight } from "lowlight";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";

// create a lowlight instance with all languages loaded
const lowlight = createLowlight(all);
lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);

const Tiptap = ({
  value,
  onChange,
  label,
}: {
  value?: string;
  label?: string;
  onChange?: (value: string) => void;
}) => {
  const extensions = useMemo(
    () => [
      CodeBlockLowlight.configure({
        lowlight,
      }),
      StarterKit.configure({
        codeBlock: false,
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Markdown.configure({
        html: false, // Keep false if you want strict markdown output, or true to preserve some HTML
      }),
    ],
    []
  );

  const editor = useEditor({
    onUpdate: ({ editor }) => {
      // Use markdown instead of HTML
      const markdown = (editor as any)?.storage?.markdown?.getMarkdown();
      onChange?.(markdown);
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none min-h-[140px] p-4 outline-none focus:outline-none",
      },
    },
    extensions,
    content: value,
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && value !== undefined) {
      // If value is empty, just clear
      if (value === "") {
        editor.commands.clearContent();
        return;
      }

      // Prevent recursive updates if the editor content already matches
      const currentMarkdown = (editor as any)?.storage?.markdown?.getMarkdown();
      if (currentMarkdown !== value && editor.getHTML() !== value) {
        editor.commands.setContent(value);
      }
    }
  }, [value, editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor?.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor?.chain().focus().extendMarkRange("link").unsetLink().run();

      return;
    }

    // update link
    try {
      editor
        ?.chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    } catch (e) {
      if (e instanceof Error) {
        alert(e.message);
      }
    }
  }, [editor]);

  const editorState = useEditorState({
    editor,
    selector: (ctx) => ({
      isLink: ctx.editor?.isActive("link"),
    }),
  });

  const toggleHeading = useCallback(
    (level: 1 | 2 | 3) => {
      if (!editor) return;

      // If already this heading level, toggle it off to return to paragraph
      if (editor.isActive("heading", { level })) {
        editor.chain().focus().setParagraph().run();
      } else {
        // Convert current block to heading and remove any trailing empty paragraph
        editor.chain().focus().toggleHeading({ level }).run();

        // Remove any automatically created empty paragraph after the heading
        setTimeout(() => {
          const doc = editor.getJSON();
          if (doc.content && doc.content.length > 1) {
            const lastNode = doc.content[doc.content.length - 1];
            if (
              lastNode.type === "paragraph" &&
              (!lastNode.content || lastNode.content.length === 0)
            ) {
              editor.commands.deleteNode("paragraph");
            }
          }
        }, 10);
      }
    },
    [editor]
  );

  return (
    <>
      {label && (
        <label className="block text-lg font-medium text-white py-2">
          {label}
        </label>
      )}
      <div className="w-full rounded-xl border border-white/10 bg-secondary/50 overflow-hidden shadow-sm">
        <div className="flex items-center gap-1 p-2 border-b border-white/10 bg-primary/30 backdrop-blur-sm">
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={`p-2 rounded-lg transition-all duration-200 ${
              editor?.isActive("bold")
                ? "bg-main text-white shadow-md"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
            title="Bold"
          >
            <FaBold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={`p-2 rounded-lg transition-all duration-200 ${
              editor?.isActive("italic")
                ? "bg-main text-white shadow-md"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
            title="Italic"
          >
            <FaItalic className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-white/10 mx-1" />

          <button
            type="button"
            onClick={() => toggleHeading(1)}
            className={`px-3 py-1.5 text-sm font-bold rounded-lg transition-all duration-200 ${
              editor?.isActive("heading", { level: 1 })
                ? "bg-main text-white shadow-md"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
            title="Heading 1"
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => toggleHeading(2)}
            className={`px-3 py-1.5 text-sm font-bold rounded-lg transition-all duration-200 ${
              editor?.isActive("heading", { level: 2 })
                ? "bg-main text-white shadow-md"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
            title="Heading 2"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => toggleHeading(3)}
            className={`px-3 py-1.5 text-sm font-bold rounded-lg transition-all duration-200 ${
              editor?.isActive("heading", { level: 3 })
                ? "bg-main text-white shadow-md"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
            title="Heading 3"
          >
            H3
          </button>
          <button
            type="button"
            onClick={setLink}
            className={`p-2 rounded-lg transition-all duration-200 ${
              editorState?.isLink
                ? "bg-main text-white shadow-md"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
            title="Set Link"
          >
            <FaLink />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded-lg transition-all duration-200 ${
              editor?.isActive("bulletList")
                ? "bg-main text-white shadow-md"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
            title="Bullet List"
          >
            <FaListUl />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded-lg transition-all duration-200 ${
              editor?.isActive("orderedList")
                ? "bg-main text-white shadow-md"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
            title="Ordered List"
          >
            <FaListOl />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
            className={`p-2 rounded-lg transition-all duration-200 ${
              editor?.isActive("codeBlock")
                ? "bg-main text-white shadow-md"
                : "text-gray-400 hover:bg-white/5 hover:text-white"
            }`}
            title="Code Block"
          >
            <FaCode />
          </button>
        </div>

        <div
          className="bg-primary/20 min-h-44 cursor-text"
          onClick={() => editor?.chain().focus().run()}
        >
          <EditorContent editor={editor} />
        </div>
      </div>
    </>
  );
};

export default Tiptap;
