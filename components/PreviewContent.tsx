import React from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Code } from "bright";
import rehypeRaw from "rehype-raw";

Code.theme = {
  dark: "github-dark",
  light: "github-light",
  lightSelector: "html.light",
};

function PreviewContent({ content }: { content: string }) {
  // Use content directly, no more complex custom HTML decoding
  const source = content || "";

  return (
    <div className="prose prose-invert prose-headings:font-bold prose-p:text-gray-400 prose-ol:text-gray-400 prose-ul:text-gray-400 prose-code:text-gray-100 prose-code:before:content-none prose-code:after:content-none max-w-full">
      <MDXRemote
        source={source}
        options={{
          mdxOptions: {
            format: "md",
            rehypePlugins: [rehypeRaw as any],
          },
        }}
        components={{
          pre: (props) => {
            return (
              <div className="not-prose">
                <Code
                  {...props}
                  lineNumbers
                  style={{
                    margin: "1.5rem 0",
                  }}
                />
              </div>
            );
          },
        }}
      />
    </div>
  );
}

export default PreviewContent;
