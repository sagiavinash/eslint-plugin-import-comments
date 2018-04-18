import path from 'path';
import rule from '../../../lib/rules/import-comments';
import test from '../files/index.js';
import {RuleTester} from 'eslint';

RuleTester.setDefaultConfig({parser: 'babel-eslint'});

const ruleTester = new RuleTester();

const injectConfig = (testCases, testConfig) => Object.assign(testCases, {
  valid: testCases.valid.map((testCase) => Object.assign(testCase, testConfig)),
  invalid: testCases.invalid.map((testCase) => Object.assign(testCase, testConfig))
});

const testEslintConfig = {
  options: [{
    moduleType: 'nodeModule',
    comment: ' vendor modules'
  }, {
    moduleType: 'testModule',
    paths: ['tests/lib/files/'],
    comment: ' test modules'
  }]
};

const mockSourceFileLocation = path.join(process.cwd(), './tests/lib/files/');

ruleTester.run('import-comments', rule, injectConfig({
  valid: [
    {
      code: `
        // test modules
        import x from "./existent-file";
        import y from "./existent-file-2";
      `,
      filename: mockSourceFileLocation
    },
    {
      code: `
        // vendor modules
        import x from "path";
      `,
      filename: mockSourceFileLocation
    }
  ],
  invalid: [
    {
      code: `
        import x from "./existent-file";
        import y from "path";
      `,
      filename: mockSourceFileLocation,
      errors: [{
        message: 'module import: no associated "\\\\ test modules" comment'
      }, {
        message: 'module import: no associated "\\\\ vendor modules" comment',
      }]
    },
    // {
    //   code: `
    //     // test modules
    //     import x from "./existent-file";
    //     // vendor modules
    //     import y from "path";
    //   `,
    //   filename: path.join(process.cwd(), './tests/lib/files/'),
    //   errors: [
    //     {
    //       message: 'module needs to come after "nodeModule" modules'
    //     },
    //     {
    //       message: 'module import: no associated "\\\\ test modules" comment'
    //     }
    //   ]
    // }
  ],
}, testEslintConfig));