$ErrorActionPreference = 'Stop'

$forbiddenGitCommand = [regex]::new(
    @'
(?:^|[\\/]|[\s"'])git(?:\.exe)?["']?(?:\s+[^;&|\r\n]+?){0,6}\s+(?:add|stage|update-index|rm|mv|reset|commit|commit-tree|merge|cherry-pick|revert|rebase|am)(?=\s|$|[;&|"'])
'@,
    [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
)

$stagedRestore = [regex]::new(
    @'
(?:^|[\\/]|[\s"'])git(?:\.exe)?["']?[^;&|\r\n]*?\s+restore\b[^;&|\r\n]*?--staged\b
'@,
    [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
)

$indexedApply = [regex]::new(
    @'
(?:^|[\\/]|[\s"'])git(?:\.exe)?["']?[^;&|\r\n]*?\s+apply\b[^;&|\r\n]*?(?:--index|--cached)\b
'@,
    [System.Text.RegularExpressions.RegexOptions]::IgnoreCase
)

function Write-Denial {
    param([Parameter(Mandatory)][string]$Reason)

    @{
        hookSpecificOutput = @{
            hookEventName            = 'PreToolUse'
            permissionDecision       = 'deny'
            permissionDecisionReason = $Reason
        }
    } | ConvertTo-Json -Compress -Depth 4 | Write-Output
}

function Test-PlainTextInspection {
    param([Parameter(Mandatory)][string]$Command)

    $trimmed = $Command.Trim()
    return (
        $trimmed -notmatch '[;&|`]|\$\(' -and
        $trimmed -match '^(?:rg|grep|select-string)(?:\.exe)?\b'
    )
}

function Test-ForbiddenGitWrite {
    param([Parameter(Mandatory)][string]$Command)

    if (Test-PlainTextInspection -Command $Command) {
        return $false
    }

    return (
        $forbiddenGitCommand.IsMatch($Command) -or
        $stagedRestore.IsMatch($Command) -or
        $indexedApply.IsMatch($Command)
    )
}

try {
    $event = [Console]::In.ReadToEnd() | ConvertFrom-Json
    $commands = @($event.tool_input.command)

    foreach ($command in $commands) {
        if ($command -is [string] -and (Test-ForbiddenGitWrite -Command $command)) {
            Write-Denial -Reason 'Git staging and history writes are disabled in this repository. Leave changes unstaged for the repository owner.'
            break
        }
    }
}
catch {
    Write-Denial -Reason 'The repository Git-write guard could not validate this shell command.'
}
