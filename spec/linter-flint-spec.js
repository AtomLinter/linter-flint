'use babel';

import {
  // eslint-disable-next-line no-unused-vars
  it, fit, wait, beforeEach, afterEach,
} from 'jasmine-fix';
import * as path from 'path';

const { lint } = require('../lib/linter-flint.js').provideLinter();

const goodPath = path.join(__dirname, 'fixtures', 'goodProj', 'package.json');
const badPath = path.join(__dirname, 'fixtures', 'badProj', 'package.json');

describe('The Flint provider for Linter', () => {
  beforeEach(async () => {
    // Close any open file
    atom.workspace.destroyActivePaneItem();
    // Close all project paths
    const projectPaths = atom.project.getPaths();
    projectPaths.forEach(projectPath => atom.project.removePath(projectPath));
    // Activate the linter
    await atom.packages.activatePackage('linter-flint');
  });

  it('checks a project with no issues and finds nothing wrong', async () => {
    atom.project.addPath(path.dirname(goodPath));
    const editor = await atom.workspace.open(goodPath);
    const messages = await lint(editor);
    expect(messages.length).toBe(0);
  });

  it('checks a project with issues and reports the found issues', async () => {
    atom.project.addPath(path.dirname(badPath));
    const projectPath = atom.project.relativizePath(badPath)[0];
    const editor = await atom.workspace.open(badPath);
    const messages = await lint(editor);

    expect(messages[0].severity).toBe('warning');
    expect(messages[0].description).toBe('A bootstrap script makes setup a snap.');
    expect(messages[0].url).toBe('http://bit.ly/JZjVL6');
    expect(messages[0].excerpt).toBe('Bootstrap script not found');
    expect(messages[0].location.file).toBe(`${projectPath}/flint-messages`);
    expect(messages[0].location.position).toEqual([[0, 0], [0, 0]]);

    expect(messages[1].severity).toBe('warning');
    expect(messages[1].description).toBe('Make it easy to run the test suite regardless of project type.');
    expect(messages[1].url).toBe('http://bit.ly/JZjVL6');
    expect(messages[1].excerpt).toBe('Test script not found');
    expect(messages[1].location.file).toBe(`${projectPath}/flint-messages`);
    expect(messages[1].location.position).toEqual([[0, 0], [0, 0]]);
  });
});
