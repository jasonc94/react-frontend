import { useEffect } from 'react';
import styles from './deploy-react.module.scss';
import ReactMarkdown from 'react-markdown';
import deployReact from '../markdowns/deploy-react/deploy-react.md?raw';
import { Flex } from '@mantine/core';

export function DeployReact() {
  return (
    <Flex direction={'row'} justify={'center'}>
      <div>
        <ReactMarkdown>{deployReact}</ReactMarkdown>
      </div>
    </Flex>
  );
}

export default DeployReact;
