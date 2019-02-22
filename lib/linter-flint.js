'use babel';

// eslint-disable-next-line import/no-extraneous-dependencies, import/extensions
import { CompositeDisposable } from 'atom';
import { exec } from 'atom-linter';
import { dirname } from 'path';

// Internal vars
// Example: https://regex101.com/r/OfS9w0/2/
const regex = /\[([A-Z]+)\] (.+)(?:\n\[INFO\] ([^\n.]+.)(?: (http:.+))?\n?)?/gm;

export default {
  activate() {
    require('atom-package-deps').install('linter-flint');

    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(
      atom.config.observe('linter-flint.executablePath', (value) => {
        this.executablePath = value;
      }),
      atom.config.observe('linter-flint.skipReadme', (value) => {
        this.skipReadme = value;
      }),
      atom.config.observe('linter-flint.skipContributing', (value) => {
        this.skipContributing = value;
      }),
      atom.config.observe('linter-flint.skipLicense', (value) => {
        this.skipLicense = value;
      }),
      atom.config.observe('linter-flint.skipBootstrap', (value) => {
        this.skipBootstrap = value;
      }),
      atom.config.observe('linter-flint.skipTestScript', (value) => {
        this.skipTestScript = value;
      }),
      atom.config.observe('linter-flint.skipScripts', (value) => {
        this.skipScripts = value;
      }),
    );
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  provideLinter() {
    return {
      name: 'Flint',
      grammarScopes: ['*'],
      scope: 'project',
      lintsOnChange: false,
      lint: async (editor) => {
        const filePath = editor.getPath();
        let projectPath = atom.project.relativizePath(filePath)[0];
        if (projectPath === null) {
          projectPath = dirname(filePath);
        }

        const execArgs = ['--no-color'];
        if (this.skipReadme) {
          execArgs.push('--skip-readme');
        }
        if (this.skipContributing) {
          execArgs.push('--skip-contributing');
        }
        if (this.skipLicense) {
          execArgs.push('--skip-license');
        }
        if (this.skipBootstrap) {
          execArgs.push('--skip-bootstrap');
        }
        if (this.skipTestScript) {
          execArgs.push('--skip-test-script');
        }
        if (this.skipScripts) {
          execArgs.push('--skip-scripts');
        }

        const execOpts = {
          cwd: projectPath,
          stream: 'stderr',
        };

        const output = await exec(this.executablePath, execArgs, execOpts);

        const messages = [];

        let match = regex.exec(output);
        while (match !== null) {
          const [type, excerpt, info, url] = match.slice(1);
          if (type !== 'OK') {
            const message = {
              severity: type === 'WARNING' ? 'warning' : 'error',
              excerpt,
              location: {
                file: `${projectPath}/flint-messages`,
                position: [[0, 0], [0, 0]],
              },
            };
            if (url) {
              message.url = url;
            }
            if (info) {
              message.description = info;
            }
            messages.push(message);
          }
          match = regex.exec(output);
        }
        return messages;
      },
    };
  },
};
