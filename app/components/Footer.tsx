import { Group, Button, Text } from '@mantine/core';
import { GithubIcon } from 'lucide-react';

export const Footer = () => (
    <>
    <Group justify="center" gap="xs">
    <Button
      component="a"
      href="https://github.com/DrMyth/VideoDubber"
      target="_blank"
      variant="subtle"
      leftSection={<GithubIcon size={20} />}
    >
      Source Code
    </Button>
    </Group>
    <Text c="dimmed" size="sm" ta="center">
    This is an unofficial tool, not made or endorsed by Discord.
    </Text>
    </>
  
);