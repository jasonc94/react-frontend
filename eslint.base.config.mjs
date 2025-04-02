import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: ['**/dist'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
          depConstraints: [
            {
              sourceTag: 'app',
              onlyDependOnLibsWithTags: [
                'feature',
                'data-access',
                'ui',
                'util',
              ],
            },
            {
              sourceTag: 'feature',
              onlyDependOnLibsWithTags: [
                'feature',
                'data-access',
                'ui',
                'util',
              ],
            },
            {
              sourceTag: 'ui',
              onlyDependOnLibsWithTags: ['data-access', 'ui', 'util'],
            },
            {
              sourceTag: 'data-access',
              onlyDependOnLibsWithTags: ['data-access', 'util'],
            },
            {
              sourceTag: 'util',
              onlyDependOnLibsWithTags: ['util'],
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {},
  },
];
