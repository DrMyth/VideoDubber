import { Button } from '@mantine/core';

export const CopyButton = ({ copyText, status }: {
  copyText: () => void;
  status: string;
}) => (
  <Button
    fullWidth
    size="lg"
    onClick={copyText}
    variant={status === "Copied!" ? "filled" : "light"}
    color={status === "Copied!" ? "green" : "blue"}
  >
    {status}
  </Button>
);