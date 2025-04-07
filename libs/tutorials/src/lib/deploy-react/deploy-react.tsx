import deployReact from '../markdowns/deploy-react/deploy-react.md?raw';
import { Flex } from '@mantine/core';

import MarkdownRenderer from '../markdown-renderer';

export function DeployReact() {
  return <MarkdownRenderer markdown={deployReact} />;
}

export default DeployReact;
