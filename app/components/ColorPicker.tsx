import { Group, Text, Button, Tooltip, Box } from '@mantine/core';

export const ColorPicker = ({ colors, label, applyStyle }: {
  colors: Array<{ code: number; color: string; name: string }>;
  label: string;
  applyStyle: (code: number) => void;
}) => (
  <Box>
    <Text fw={500} mb="xs" size="sm" c="dimmed">
      {label}
    </Text>
    <Group gap="xs">
      {colors.map((color) => (
        <Tooltip key={color.code} label={color.name} position="top" withArrow>
          <Button
            variant="filled"
            style={{
              backgroundColor: color.color,
              width: 32,
              height: 32,
              minWidth: 32,
              padding: 0,
              borderColor: "#4f545c",
            }}
            onClick={() => applyStyle(color.code)}
          />
        </Tooltip>
      ))}
    </Group>
  </Box>
);