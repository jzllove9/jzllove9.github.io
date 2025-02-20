---
title: 代码秒变提示词，这款 CLI 工具太神奇！开发者必备神器
description: 代码秒变提示词，这款 CLI 工具太神奇！开发者必备神器
date: 2025-02-19
---

在软件开发的世界里，与大型语言模型（LLM）打交道已成为常态。无论是代码生成、代码审查还是代码优化，LLM 都能提供强大的支持。然而，将整个代码库转换成一个适合 LLM 处理的提示词，却并非易事。今天，就给大家介绍一款超实用的 CLI 工具——code2prompt，它能轻松将你的代码库转换成一个单一的 LLM 提示词，让你的开发效率瞬间提升！

## 一、code2prompt 是什么？

code2prompt 是一款命令行工具，它能够遍历你的代码库，生成一个包含源代码树结构和所有代码的格式化 Markdown 提示词。这个提示词可以直接用于 GPT 或 Claude 等模型，让你能够快速生成代码文档、发现潜在的安全漏洞、优化代码性能等。

## 二、功能亮点

1. **快速生成提示词**：无论你的代码库有多大，code2prompt 都能迅速生成提示词，节省你大量手动整理代码的时间。
2. **自定义模板**：支持使用 Handlebars 模板，你可以根据自己的需求定制提示词的生成方式。内置了多种模板，如代码文档生成、安全漏洞检测、代码优化等。
3. **尊重 `.gitignore`**：默认情况下，code2prompt 会遵循 `.gitignore` 文件中的规则，避免将不需要的文件包含在提示词中。当然，你也可以通过参数禁用这一功能。
4. **文件过滤与排除**：支持使用 glob 模式过滤和排除文件，还能根据文件名或路径排除特定文件和文件夹。
5. **显示 token 数量**：能够显示生成提示词的 token 数量，这对于控制 LLM 的输入长度非常有帮助。
6. **集成 Git 功能**：可以将 Git diff 输出（已暂存文件）包含在生成的提示词中，方便进行代码对比和审查。
7. **自动复制到剪贴板**：生成的提示词会自动复制到剪贴板，省去手动复制的麻烦。
8. **支持多种编码**：支持多种 token 编码方式，如 `cl100k`、`p50k` 等，适配不同的 LLM 模型。

## 三、安装与使用

### 安装

1. **二进制发布版**：直接从 [Releases](https://github.com/mufeedvh/code2prompt/releases) 页面下载适用于你操作系统的最新二进制文件。
2. **源码构建**：如果你喜欢从源码构建，确保你安装了 Git、Rust 和 Cargo，然后克隆仓库并运行 `cargo build --release`。
3. **cargo 安装**：通过 `cargo install code2prompt` 命令直接从 `crates.io` 注册表安装。
4. **AUR 安装**：如果你使用的是 Arch Linux，可以通过 AUR 安装。
5. **Nix 安装**：使用 Nix 的用户可以通过 `nix-env` 或 `profile` 安装。

### 使用

基本命令格式为 `code2prompt path/to/codebase`，以下是一些常用参数：

- `-t path/to/template.hbs`：指定自定义模板文件。
- `--include="*.rs,*.toml"`：使用 glob 模式包含特定文件。
- `--exclude="*.txt,*.md"`：使用 glob 模式排除特定文件。
- `--tokens`：显示生成提示词的 token 数量。
- `--output=output.txt`：将生成的提示词保存到指定文件。
- `--json`：以 JSON 格式输出结果。
- `--diff`：包含 Git diff 输出（已暂存文件）。
- `--line-number`：在源代码块中添加行号。
- `--hidden`：包含隐藏文件和目录。
- `--no-ignore`：禁用 `.gitignore` 规则。

## 四、内置模板介绍

code2prompt 内置了多种实用的模板，满足不同的开发需求：

- **document-the-code.hbs**：用于生成代码文档，为所有公共函数、方法、类和模块添加文档注释。
- **find-security-vulnerabilities.hbs**：用于检测代码库中的潜在安全漏洞，并提供修复建议。
- **clean-up-code.hbs**：用于清理和优化代码，提高代码质量。
- **fix-bugs.hbs**：用于诊断和修复代码中的错误。
- **write-github-pull-request.hbs**：用于生成 GitHub 拉取请求描述，通过比较两个分支的 Git diff 和 Git log 来创建。
- **write-github-readme.hbs**：用于生成项目的 README 文件，分析代码库的功能和用途，生成 Markdown 格式的内容。
- **write-git-commit.hbs**：用于生成 Git 提交信息，分析已暂存文件的代码库，生成 Markdown 格式的提交信息。
- **improve-performance.hbs**：用于优化代码性能，寻找优化机会并提供具体建议。

## 五、总结

code2prompt 无疑是一款开发者必备的神器，它极大地简化了将代码库转换为 LLM 提示词的过程，让你能够更高效地利用 LLM 进行代码相关的工作。无论是代码文档生成、安全漏洞检测还是代码优化，code2prompt 都能轻松胜任。赶紧试试这款工具，让你的开发工作更上一层楼！