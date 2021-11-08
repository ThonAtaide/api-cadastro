import type {Config} from '@jest/types';

const config: Config.InitialOptions = {
    verbose: true,
    setupFilesAfterEnv: [
        "./__tests__/config/setup.ts"
    ],
    testTimeout: 30000,
    modulePathIgnorePatterns: [
        "__tests__/config/",
        "__tests__/factory/"
    ]
};

export default config;

