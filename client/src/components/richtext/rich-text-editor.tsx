import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

function TipTapEditor({ value, onChange, placeholder }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
    ],
    content: value,
    onUpdate: ({ editor: nextEditor }) => {
      onChange(nextEditor.getHTML());
    },
  });

  useEffect(() => {
    // Keep editor content in sync if parent loads existing article content.
    if (value !== editor.getHTML()) editor.commands.setContent(value);
  }, [editor, value]);

  return (
    <div className="rounded-lg border bg-background">
      <div className="flex flex-wrap items-center gap-1 border-b bg-muted/30 p-2">
        <button
          type="button"
          className="rounded px-2 py-1 text-xs hover:bg-muted"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Bold
        </button>
        <button
          type="button"
          className="rounded px-2 py-1 text-xs hover:bg-muted"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Italic
        </button>
        <button
          type="button"
          className="rounded px-2 py-1 text-xs hover:bg-muted"
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          Strike
        </button>
        <button
          type="button"
          className="rounded px-2 py-1 text-xs hover:bg-muted"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </button>
        <button
          type="button"
          className="rounded px-2 py-1 text-xs hover:bg-muted"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          Bullets
        </button>
        <button
          type="button"
          className="rounded px-2 py-1 text-xs hover:bg-muted"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          Numbered
        </button>
        <button
          type="button"
          className="rounded px-2 py-1 text-xs hover:bg-muted"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          HR
        </button>
        <button
          type="button"
          className="rounded px-2 py-1 text-xs hover:bg-muted"
          onClick={() => {
            const href = window.prompt("Enter link URL");
            if (!href) return;
            editor
              .chain()
              .focus()
              .extendMarkRange("link")
              .setLink({ href })
              .run();
          }}
        >
          Link
        </button>
      </div>

      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none bg-background p-3 dark:prose-invert prose-headings:font-semibold prose-p:leading-7 prose-li:leading-7"
      />

      {placeholder ? (
        <div className="sr-only" aria-hidden="true">
          {placeholder}
        </div>
      ) : null}
    </div>
  );
}

export function RichTextEditor({ value, onChange, placeholder }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="rounded-lg border bg-background p-3 text-sm text-muted-foreground">
        Loading editor...
      </div>
    );
  }

  return <TipTapEditor value={value} onChange={onChange} placeholder={placeholder} />;
}

