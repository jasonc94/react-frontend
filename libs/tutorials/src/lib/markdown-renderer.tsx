import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';
import { LightAsync as SyntaxHighlighter } from 'react-syntax-highlighter';
import nightOwl from 'react-syntax-highlighter/dist/esm/styles/hljs/night-owl';
import js from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import python from 'react-syntax-highlighter/dist/esm/languages/hljs/python';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import yaml from 'react-syntax-highlighter/dist/esm/languages/hljs/yaml';
import csharp from 'react-syntax-highlighter/dist/esm/languages/hljs/csharp';
import ts from 'react-syntax-highlighter/dist/esm/languages/hljs/typescript';

export function MarkdownRenderer({ markdown }: { markdown: string }) {
  SyntaxHighlighter.registerLanguage('javascript', js);
  SyntaxHighlighter.registerLanguage('js', js);
  SyntaxHighlighter.registerLanguage('python', python);
  SyntaxHighlighter.registerLanguage('py', python);
  SyntaxHighlighter.registerLanguage('json', json);
  SyntaxHighlighter.registerLanguage('yaml', yaml);
  SyntaxHighlighter.registerLanguage('yml', yaml);
  SyntaxHighlighter.registerLanguage('c#', csharp);
  SyntaxHighlighter.registerLanguage('ts', ts);

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || '');

          return !inline && match ? (
            <SyntaxHighlighter
              style={nightOwl}
              PreTag="div"
              language={match[1]}
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {markdown}
    </ReactMarkdown>
  );
}

export default MarkdownRenderer;
