import process from 'node:process';

const forbiddenSubcommands = [
  'add',
  'stage',
  'update-index',
  'rm',
  'mv',
  'reset',
  'commit',
  'commit-tree',
  'merge',
  'cherry-pick',
  'revert',
  'rebase',
  'am',
];

const escapedSubcommands = forbiddenSubcommands
  .map((subcommand) => subcommand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  .join('|');

// Match direct, absolute-path, and shell-wrapped Git invocations. Allowing a few
// tokens between the executable and subcommand also covers Git global options
// such as `-C`, `--git-dir`, and `-c`.
const forbiddenGitCommand = new RegExp(
  String.raw`(?:^|[\\/]|[\s"'])git(?:\.exe)?["']?(?:\s+[^;&|\r\n]+?){0,6}\s+(?:${escapedSubcommands})(?=\s|$|[;&|"'])`,
  'i',
);

const stagedRestore = new RegExp(
  String.raw`(?:^|[\\/]|[\s"'])git(?:\.exe)?["']?[^;&|\r\n]*?\s+restore\b[^;&|\r\n]*?--staged\b`,
  'i',
);

const indexedApply = new RegExp(
  String.raw`(?:^|[\\/]|[\s"'])git(?:\.exe)?["']?[^;&|\r\n]*?\s+apply\b[^;&|\r\n]*?(?:--index|--cached)\b`,
  'i',
);

function isPlainTextInspection(command) {
  const trimmed = command.trim();

  if (/[;&|`]|\$\(/u.test(trimmed)) {
    return false;
  }

  return /^(?:rg|grep|select-string)(?:\.exe)?\b/iu.test(trimmed);
}

function containsForbiddenGitWrite(command) {
  if (isPlainTextInspection(command)) {
    return false;
  }

  return (
    forbiddenGitCommand.test(command) ||
    stagedRestore.test(command) ||
    indexedApply.test(command)
  );
}

function deny(reason) {
  process.stdout.write(
    `${JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: reason,
      },
    })}\n`,
  );
}

let input = '';

for await (const chunk of process.stdin) {
  input += chunk;
}

try {
  const event = JSON.parse(input);
  const rawCommand = event?.tool_input?.command;
  const commands = Array.isArray(rawCommand) ? rawCommand : [rawCommand];

  if (
    commands.some(
      (command) =>
        typeof command === 'string' && containsForbiddenGitWrite(command),
    )
  ) {
    deny(
      'Git staging and history writes are disabled in this repository. Leave changes unstaged for the repository owner.',
    );
  }
} catch {
  deny('The repository Git-write guard could not validate this shell command.');
}
