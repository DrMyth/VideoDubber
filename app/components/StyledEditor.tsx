import { Paper } from '@mantine/core';
import ContentEditable from 'react-contenteditable';

export const StyledEditor = ({ html, handleChange, editorRef }: {
  html: string;
  handleChange: (evt: any) => void;
  editorRef: React.RefObject<any>;
}) => (
  <Paper
    withBorder
    p="md"
    style={{
      backgroundColor: "#2F3136",
      minHeight: "200px",
      maxHeight: "400px",
      overflow: "auto",
      textAlign: "left",
      fontFamily: "monospace",
      fontSize: "0.875rem",
      lineHeight: "1.125rem",
    }}
  >
    <ContentEditable
      innerRef={editorRef}
      html={html}
      onChange={handleChange}
      tagName="div"
      style={{ 
        outline: "none",
        minHeight: "100px",
        caretColor: "white",
      }}
    />
  </Paper>
);