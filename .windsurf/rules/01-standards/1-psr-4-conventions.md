---
trigger: model_decision
description: Enforce PSR-4 autoloading conventions for all PHP source files to ensure interoperability, maintainability, and compatibility with modern PHP tools and frameworks.
globs: **/src/**/*.php
---

- Namespace matches directory structure
- Top-level namespace is vendor name
- Use at least two namespace levels
- Allow path infix after vendor-package
- Map vendor-package to any directory
- Map sub-namespaces to subdirectories
- File name matches class name
- Use .php extension for all classes
- No underscores as directory separators
- Do not throw in autoloader
