/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */
// jest.config.ts
//export default require('./jest.config.setup');

export default {

    clearMocks: true,
  
    // Indicates whether the coverage information should be collected while executing the test
    collectCoverage: true,
  
    // An array of glob patterns indicating a set of files for which coverage information should be collected
    // collectCoverageFrom: undefined,
  
    // The directory where Jest should output its coverage files
    coverageDirectory: "coverage",
  
    // An array of regexp pattern strings used to skip coverage collection
    coveragePathIgnorePatterns: [
      "\\\\node_modules\\\\"
    ],
  
    // Indicates which provider should be used to instrument code for coverage
    coverageProvider: "v8",
  
  
  
    // An array of file extensions your modules use
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  
    // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
    // moduleNameMapper: {},
  
  
    // The test environment that will be used for testing
    testEnvironment: "jsdom",
  
    // The regexp pattern or array of patterns that Jest uses to detect test files
    // testRegex: [],
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  
    // A map from regular expressions to paths to transformers
     transform: {
      "^.+\\.tsx?$": "ts-jest"
    },
  
  };
  