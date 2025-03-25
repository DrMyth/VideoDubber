"use client";

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
  [class^="ansi-"] { color: #ffffff; }
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
  const contentEditableRef = useRef(null);

  const handleChange = (evt: any) => setHtml(evt.target.value);
  const applyStyle = (code: any) => {
    const selection = window.getSelection();
    if (!selection?.rangeCount) return;

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
      const styleType = Math.floor(code / 10);

      const walker = document.createTreeWalker(
        fragment,
        NodeFilter.SHOW_ELEMENT
      );
      const nodesToClean = [];
      let currentNode;

      while ((currentNode = walker.nextNode())) {
        nodesToClean.push(currentNode);
      }

      nodesToClean.forEach((node) => {
        node.classList.forEach((className) => {
          const match = className.match(/ansi-(\d+)/);
          if (match) {
            const classCode = parseInt(match[1]);
            if (Math.floor(classCode / 10) === styleType) {
              node.classList.remove(className);
            }
          }
        });
      });

      span.className = `ansi-${code}`;
      span.appendChild(fragment);
      range.insertNode(span);

      if (contentEditableRef.current) {
        setHtml(contentEditableRef.current.innerHTML);
      }
    } catch (error) {
      console.error("Error applying style:", error);
    }
  };

  const resetAll = () => setHtml("Welcome to Discord Colored Text Generator!");

  const nodesToANSI = (nodes: any, currentStyles = []) => {
    let output = "";
    for (const node of nodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        output += node.textContent;
        continue;
      }
      if (node.nodeName === "BR") {
        output += "\n";
        continue;
      }

      const styles = new Set(currentStyles);
      Array.from(node.classList).forEach((className) => {
        const match = className.match(/ansi-(\d+)/);
        if (match) styles.add(parseInt(match[1]));
      });

      const styleCodes = Array.from(styles);
      output += `\x1b[${styleCodes.join(";")}m`;
      output += nodesToANSI(node.childNodes, styleCodes);
      output += `\x1b[0m`;
      if (currentStyles.length > 0) {
        output += `\x1b[${currentStyles.join(";")}m`;
      }
    }
    return output;
  };

  const getANSIFromHTML = () => {
    if (!contentEditableRef.current) return "";
    return (
      "\x1b[0m" +
      nodesToANSI(contentEditableRef.current.childNodes) +
      "\x1b[0m\n"
    );
  };

  const copyText = async () => {
    const ansiText = getANSIFromHTML();
    const formattedText = "```ansi\n" + ansiText + "\n```";
    await navigator.clipboard.writeText(formattedText);
    setCopyStatus("Copied!");
    setTimeout(() => setCopyStatus("Copy text as Discord formatted"), 2000);
  };

  useEffect(() => {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = styleFix;
    document.head.appendChild(styleTag);

    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  return (
    <Container size="md" py="xl">
      <Stack gap="lg">
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
