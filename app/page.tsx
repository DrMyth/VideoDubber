'use client';

import { useState, useRef, useEffect } from "react";
import { Container, Stack, Paper } from "@mantine/core";
import { Header } from "./components/Header";
import { ColorPicker } from "./components/ColorPicker";
import { StyledEditor } from "./components/StyledEditor";
import { Controls } from "./components/Controls";
import { CopyButton } from "./components/CopyButton";
import { Footer } from "./components/Footer";
import { COLORS } from "../lib/utils";

const styleFix = `
  .ansi-1 { font-weight: bold !important; }
  .ansi-4 { text-decoration: underline !important; }
  ${COLORS.foreground
    .map(
      (c) => `
    .ansi-${c.code} { color: ${c.color} !important; }
  `
    )
    .join("")}
  ${COLORS.background
    .map(
      (c) => `
    .ansi-${c.code} { background-color: ${c.color} !important; }
  `
    )
    .join("")}
`;

export default function Home() {
  const [html, setHtml] = useState(
    '<span class="ansi-37">Welcome to Discord Colored Text Generator!</span>'
  );
  const [copyStatus, setCopyStatus] = useState(
    "Copy text as Discord formatted"
  );
  const contentEditableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = styleFix;
    document.head.appendChild(styleTag);
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  const handleChange = (evt: any) => setHtml(evt.target.value);

  const removeConflictingAnsiClasses = (element: Element, newType: number) => {
    Array.from(element.classList).forEach((cls) => {
      const match = cls.match(/^ansi-(\d+)/);
      if (match) {
        const existingCode = parseInt(match[1]);
        const existingType = Math.floor(existingCode / 10);
        if (existingType === newType) {
          element.classList.remove(cls);
        }
      }
    });
  };

  const applyStyle = (code: number) => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);

    if (
      range.startContainer === range.endContainer &&
      range.startContainer.nodeType === Node.ELEMENT_NODE
    ) {
      range.selectNodeContents(range.startContainer);
    }

    try {
      const fragment = range.extractContents();
      const span = document.createElement("span");
      const newType = Math.floor(code / 10);

      const walker = document.createTreeWalker(
        fragment,
        NodeFilter.SHOW_ELEMENT
      );
      let node: Node | null;
      while ((node = walker.nextNode())) {
        removeConflictingAnsiClasses(node as Element, newType);
      }
      Array.from(fragment.childNodes).forEach((child) => {
        if (child.nodeType === Node.ELEMENT_NODE) {
          removeConflictingAnsiClasses(child as Element, newType);
        }
      });

      span.className = `ansi-${code}`;
      span.appendChild(fragment);
      range.insertNode(span);

      if (contentEditableRef.current) {
        setHtml(contentEditableRef.current.innerHTML);
      }
      selection.removeAllRanges();
    } catch (error) {
      console.error("Error applying style:", error);
    }
  };

  const resetAll = () =>
    setHtml('Welcome to Discord Colored Text Generator!');

  const nodesToANSI = (
    nodes: NodeList,
    parentStyles: number[] = []
  ): string => {
    let output = "";
    nodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        output += node.textContent;
      } else if (node.nodeName === "BR") {
        output += "\n";
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as Element;
        let localStyles: number[] = [];
        let prefix = "";
        let suffix = "";
        if (el.tagName === "B") {
          localStyles.push(1);
          prefix += "\x1b[1m";
          suffix = "\x1b[22m";
        } else if (el.tagName === "U") {
          localStyles.push(4);
          prefix += "\x1b[4m";
          suffix = "\x1b[24m";
        } else {
          Array.from(el.classList).forEach((cls) => {
            const match = cls.match(/^ansi-(\d+)$/);
            if (match) {
              const code = parseInt(match[1]);
              localStyles.push(code);
              prefix += `\x1b[${code}m`;
              suffix = "\x1b[0m";
            }
          });
        }
        const combinedStyles = [...parentStyles.filter(ps => !localStyles.some(ls => Math.floor(ps/10) === Math.floor(ls/10))), ...localStyles];
        const inner = nodesToANSI(el.childNodes, combinedStyles);
        output += prefix + inner + suffix;
        if (parentStyles.length > 0) {
          output += `\x1b[${parentStyles.join(";")}m`;
        }
      }
    });
    return output;
  };

  const getANSIFromHTML = () => {
    if (!contentEditableRef.current) return "";
    let result = nodesToANSI(contentEditableRef.current.childNodes);
    result = result.replace(/(\x1b\[0m)+/g, "\x1b[0m");
    return result.endsWith("\x1b[0m") ? result + "\n" : result + "\x1b[0m\n";
  };

  const copyText = async () => {
    const ansiText = getANSIFromHTML();
    const formattedText = "```ansi\n" + ansiText + "\n```";
    await navigator.clipboard.writeText(formattedText);
    setCopyStatus("Copied!");
    setTimeout(() => setCopyStatus("Copy text as Discord formatted"), 2000);
  };

  return (
    <Container size="md" py="xl">
      <Stack gap="xl">
        <Header />
        <Paper p="xl" radius="lg" withBorder shadow="xs">
          <Stack gap="lg">
            <Controls resetAll={resetAll} applyStyle={applyStyle} />
            <ColorPicker
              colors={COLORS.foreground}
              label="Text Colors"
              applyStyle={applyStyle}
            />
            <ColorPicker
              colors={COLORS.background}
              label="Background Colors"
              applyStyle={applyStyle}
            />
            <StyledEditor
              html={html}
              handleChange={handleChange}
              editorRef={contentEditableRef}
            />
            <CopyButton copyText={copyText} status={copyStatus} />
          </Stack>
        </Paper>
        <Footer />
      </Stack>
    </Container>
  );
}
