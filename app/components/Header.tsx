import { Paper, Stack, Group, Title, Text } from '@mantine/core';

export const Header = () => (
  <Paper p="md" withBorder radius="lg" shadow="xs">
    <Stack gap={4} align="center">
      <Group gap="xs">
        <Title 
          order={2} 
          style={{
            fontFamily: 'Ginto Nord, sans-serif',
            fontSize: '1.8rem',
            background: 'linear-gradient(90deg, #5865F2 0%, #7289DA 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Video Dubber Text Styler
        </Title>
      </Group>
      <Text size="sm" c="dimmed" ta="center" maw={600}>
        <span style={{ color: '#b9bbbe' }}>Create</span> 
        <Text span c="#5865F2"> ANSI-styled </Text>
        <span style={{ color: '#b9bbbe' }}>messages : </span> 
        <Text span c="#3ba55c">Style text </Text>
        <span style={{ color: '#b9bbbe' }}> → </span>
        <Text span c="#ed4245"> Copy </Text>
        <span style={{ color: '#b9bbbe' }}> → Paste in Discord</span>
      </Text>
    </Stack>
  </Paper>
);