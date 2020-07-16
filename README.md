# `mdAL` VS Code Extension

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/mdal-lang/mdal-extension/Build)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/mdal-lang/mdal-extension)

This repository contains the VS Code language extension adding support for [`mdAL`](https://github.com/mdal-lang/mdal). `mdAL` is a Domain Specific Language that enables a Model-Driven approach to extension module development for the ERP System Microsoft Dynamics 365 Business Central. `mdAL` stands for **m**odel-**d**riven **AL**.

## System Requirements

To use the `mdAL` VS Code extension you need [Java JRE 8](https://www.java.com/de/download/) or newer.

## Quickstart

To quickly familiarize yourself with `mdAL` and the VS Code extension have a look at the [`mdAL` demo project](https://github.com/mdal-lang/mdal-demo). For more information on `mdAL` visit [mdal-lang.github.io](https://mdal-lang.github.io/#/).

![Extension Demo](images/extension-demo.gif)

## Creating new Projects

To start using `mdAL` [create a new AL project](https://docs.microsoft.com/en-us/dynamics365/business-central/dev-itpro/developer/devenv-get-started) (<kbd>Alt</kbd> + A, <kbd>Alt</kbd> + L) and download the symbol references. Then add your object ranges to the `app.json` file. Create a new file with the `.mdal` ending. If it is not running already the language server starts once opening an `mdAL` file. After a few seconds features like content assist and documentation hovers are available. You can trigger AL code generation either from the menu item "Generate AL Code" by right-clicking inside an `mdAL` file or by using the command palette (<kbd>Shift</kbd> + <kbd>Ctrl</kbd> + <kbd>p</kbd> or <kbd>Shift</kbd> + <kbd>Command</kbd> + <kbd>p</kbd>).

## Features

* Language Support
  * Syntax highlighting for `mdAL` files.
* Commands (available on `*.mdal` files)
  * Load symbol references: Loads the symbol references found in the `.alpackages` folder.
  * Generate AL Code: Generates AL Code from the currently opened `mdAL` file into the `src-gen` folder.
  * Clean: Deletes the `src-gen` folder.
* Menu items (available on `*.mdal` files)
  * Load symbol references
  * Generate AL Code
* Code Actions
* Content Assist
* Documentation hovers
* Snippets

If you encounter errors or have suggestions for future releases, please open an [issue](https://github.com/mdal-lang/mdal-extension/issues).

## Development

This extension is built using the build tool [Gradle](https://gradle.org/). If [Java JDK or JRE](https://www.oracle.com/de/java/technologies/javase-downloads.html) is installed, you can use the bundled Gradle wrapper and build the project with this command:

```sh
$ ./gradlew build
```

To start a new VS Code window in debug mode use this command:

```sh
$ ./gradlew debugCode
```

A list of all available Gradle tasks can be obtained with this command:

```sh
$ ./gradlew tasks
```

## License

Apache 2.0 (c) Jonathan Neugebauer
