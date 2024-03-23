import {defineConfig} from 'vitest/config'
export default defineConfig({
  test: {
    reporters: 'dot',
    resolveSnapshotPath: (path, ext) => path.replace('.test.ts', `${ext}.ts`)
  }
})
