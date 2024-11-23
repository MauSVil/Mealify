import { cn } from "@/lib/utils";
import type { Value } from "expry";

import { Prism, Highlight } from "prism-react-renderer";

(typeof global !== "undefined" ? global : window).Prism = Prism;

require("prismjs/components/prism-json");


interface CodeProps {
  code: Value;
}

export default function Code({ code }: CodeProps) {
  return (
    <Highlight
      code={JSON.stringify(code, null, 2)}
      language="json"
      theme={{ plain: {}, styles: [] }}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className={cn(
            className,
            "flex overflow-x-auto font-mono text-base leading-[170%]",
          )}
          style={style}
        >
          <code className="px-4">
            {tokens.map((line, lineIndex) => (
              <div key={lineIndex} {...getLineProps({ line })}>
                {line.map((token, tokenIndex) => (
                  <span key={tokenIndex} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </code>
        </pre>
      )}
    </Highlight>
  );
}
