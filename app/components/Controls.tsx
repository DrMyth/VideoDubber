import { Group, Button } from '@mantine/core';

export const Controls = ({ resetAll, applyStyle }: {
  resetAll: () => void;
  applyStyle: (code: number) => void;
}) => (
  <Group gap="xs">
    <Button variant="light" color="gray" onClick={resetAll}>
      Reset All
    </Button>
    <Button variant="light" onClick={() => applyStyle(1)}>
      Bold
    </Button>
    <Button variant="light" onClick={() => applyStyle(4)}>
      Underline
    </Button>
  </Group>
);