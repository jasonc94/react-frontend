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
import { ActionIcon, Tooltip } from '@mantine/core';
import { IconClipboard, IconCopy } from '@tabler/icons-react';

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

  const handleCopy = (code: string) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        console.log('Copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || '');
          const code = String(children).replace(/\n$/, '');

          return !inline && match ? (
            <div style={{ position: 'relative' }}>
              <Tooltip label="Copy to clipboard">
                <ActionIcon
                  style={{
                    position: 'absolute',
                    left: '100%',
                    transform: 'translateX(-100%)',
                  }}
                  size="xl"
                  radius="xl"
                  variant="transparent"
                  onClick={() => handleCopy(code)}
                >
                  <IconCopy size={24} />
                </ActionIcon>
              </Tooltip>
              <SyntaxHighlighter
                style={nightOwl}
                PreTag="div"
                language={match[1]}
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            </div>
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
