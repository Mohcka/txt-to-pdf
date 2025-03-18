# TXT to PDF Converter - Installation Instructions

## Installation

To install the TXT to PDF converter CLI tool globally, run:

```bash
deno install --allow-read --allow-write --allow-net --allow-import --global --name txt-to-pdf mod.tsts
```

### How Global Installation Works

When you run the installation command:

1. Deno compiles the application
2. Creates an executable named `txt-to-pdf`
3. Places this executable in Deno's bin directory:
   - On Windows: `%USERPROFILE%\.deno\bin`
   - On macOS/Linux: `$HOME/.deno/bin`

### Ensuring Global Access

For the command to be available system-wide, you must add Deno's bin directory to your PATH:

#### Windows
```powershell
# Add to PATH for current session
$env:PATH += ";$env:USERPROFILE\.deno\bin"

# For permanent addition, add to your PowerShell profile or system environment variables
```

#### macOS/Linux
```bash
# Add to your shell profile (.bashrc, .zshrc, etc.)
echo 'export PATH="$HOME/.deno/bin:$PATH"' >> ~/.bashrc
# Then source the profile
source ~/.bashrc
```

## Usage

Once installed, you can use it from anywhere in your filesystem:

```bash
txt-to-pdf path/to/your/file.txt
```

Options:
- `-o, --output <file>`: Specify the output PDF file path
- `-h, --help`: Show help information

Examples:
```bash
# Convert a file using default output name (same as input with .pdf extension)
txt-to-pdf document.txt

# Convert a file with custom output name
txt-to-pdf document.txt -o my-output.pdf
```

## Troubleshooting

If the `txt-to-pdf` command is not found after installation:

1. Check if Deno's bin directory exists in your PATH:
   ```bash
   echo $PATH  # On macOS/Linux
   echo %PATH% # On Windows Command Prompt
   $env:PATH   # On Windows PowerShell
   ```

2. If not found, add it as described above and restart your terminal
