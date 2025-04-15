# MCP Chat in the Browser

<p align='center'><b>Run Model Context Protocol (MCP) servers in the browser - no local setup required!</b></p>

<div align='center'>
<a href="https://netglade.github.io/mcp-chat/"><b>🎮 Live Demo</b></a> |
<a href="https://github.com/netglade/mcp-sandbox">📦 NPM library Repository</a> |
<a href="https://www.netglade.cz/en/blog/bringing-mcps-to-the-cloud-how-we-won-the-e2b-hackathon">📝 Blog Post</a>

<br/>
<p align='center'>🏆 <a href="https://www.linkedin.com/feed/update/urn:li:activity:7310193814466408448">Winner of the E2B Agents and AI Tools Hackathon</a></p>

[![Deploy Next.js site to Pages](https://github.com/netglade/mcp-chat/actions/workflows/deploy.yml/badge.svg)](https://github.com/netglade/mcp-chat/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
</div>

## About

Tired of wrestling with local tool installations, conflicting versions, and PATH variables? MCP Chat lets you run any Model Context Protocol (MCP) server directly in the browser using [E2B's sandbox environment](https://e2b.dev). No local setup, no version conflicts, no environment variables - just instant access to your tools.

## Why MCP Chat?

- 🚫 **No Local Setup**: Forget about installing tools locally or managing dependencies
- 🔄 **No Version Conflicts**: Each tool runs in its own isolated environment
- 🌐 **Browser-First**: Everything runs in the browser - no command line needed
- 🔒 **Clean Environment**: No PATH variables, no system modifications, no cleanup needed

## Local Setup

```bash
npm install
npm run dev
```

## How It Works

Uses [MCP Sandbox](https://github.com/netglade/mcp-sandbox) package to run MCP servers in E2B's sandbox environment

## License

[MIT](LICENSE)
