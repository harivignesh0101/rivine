import Link from "next/link";
import React, { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  const components = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <pre
          {...props}
          className={`${className} text-sm w-[80dvw] md:max-w-[500px] overflow-x-scroll bg-zinc-100 p-3 rounded-lg mt-2 dark:bg-zinc-800`}
        >
          <code className={match[1]}>{children}</code>
        </pre>
      ) : (
        <code
          className={`${className} text-sm bg-zinc-100 dark:bg-zinc-800 py-0.5 px-1 rounded-md`}
          {...props}
        >
          {children}
        </code>
      );
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ol: ({ node, children, ...props }: any) => {
      return (
        <ol className="list-decimal list-outside ml-4" {...props}>
          {children}
        </ol>
      );
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    li: ({ node, children, ...props }: any) => {
      return (
        <li className="py-1" {...props}>
          {children}
        </li>
      );
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ul: ({ node, children, ...props }: any) => {
      return (
        <ul className="list-decimal list-outside ml-4" {...props}>
          {children}
        </ul>
      );
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    strong: ({ node, children, ...props }: any) => {
      return (
        <span className="font-semibold" {...props}>
          {children}
        </span>
      );
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    a: ({ node, children, ...props }: any) => {
      return (
        <Link
          className="text-blue-500 hover:underline"
          target="_blank"
          rel="noreferrer"
          {...props}
        >
          {children}
        </Link>
      );
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    h1: ({ node, children, ...props }: any) => {
      return (
        <h1 className="text-3xl font-semibold mt-6 mb-2" {...props}>
          {children}
        </h1>
      );
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    h2: ({ node, children, ...props }: any) => {
      return (
        <h2 className="text-2xl font-semibold mt-6 mb-2" {...props}>
          {children}
        </h2>
      );
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    h3: ({ node, children, ...props }: any) => {
      return (
        <h3 className="text-xl font-semibold mt-6 mb-2" {...props}>
          {children}
        </h3>
      );
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    h4: ({ node, children, ...props }: any) => {
      return (
        <h4 className="text-lg font-semibold mt-6 mb-2" {...props}>
          {children}
        </h4>
      );
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    h5: ({ node, children, ...props }: any) => {
      return (
        <h5 className="text-base font-semibold mt-6 mb-2" {...props}>
          {children}
        </h5>
      );
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    h6: ({ node, children, ...props }: any) => {
      return (
        <h6 className="text-sm font-semibold mt-6 mb-2" {...props}>
          {children}
        </h6>
      );
    },
  };

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  );
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);
