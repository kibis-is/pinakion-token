<h1 align="center">
  Kibisis Pinakion Token
</h1>

<p align="center">
  The monorepo that contains the smart contracts and clients for the official Kibisis Pinakion NFT.
</p>

### Table Of Contents

* [1. Overview](#-1-overview)
  - [1.1. Monorepo Project Structure](#11-monorepo-project-structure)
* [2. Getting Started](#-2-getting-started)
  - [2.1. Requirements](#21-requirements)
  - [2.2. Installation](#22-installation)
* [3. Appendix](#-3-appendix)
  - [3.1. Packages](#31-packages)
  - [3.2. Useful Commands](#32-useful-commands)
* [4. How To Contribute](#-4-how-to-contribute)
* [5. License](#-5-license)

## 🗂️ 1. Overview

### 1.1. Monorepo Project Structure

The repo follows the following structure:

```text
.
├─ packages
│   ├── <package>
│   │   ├── .releaserc       <-- semantic release configuration
│   │   ├── README.md
│   │   └── ...
│   └── ...                  <-- other packages
├── COPYING                  <-- blanket and fallback license
├── package.json             <-- root package.json that contains top-level dependencies and scripts
└── ...
```

#### Root `package.json`

The root `package.json` utilizes `npm`'s workspace feature. The root `package.json` should only reference packages that are used at the root level and within scripts.

It is **RECOMMENDED** that the root `package.json` be used to run the `npm` scripts (e.g. `build`, `lint`, `test`) for each package.

#### `packages/` Directory

The `packages/` directory contains, as the name suggests, the packages of the monorepo.

#### `packages/<package>` Directory

Each package **SHOULD** reflect the name of the package, i.e. the `packages/pinakionclient/` and **SHOULD** contain the following files and directories:

* `.releaserc` - the local `semantic-release` configuration.
* `README.md` - Contains installation and usage instructions relevant to the package.

Each package **MAY** also have the following files/directories:

* `LICENSE`/`COPYING` - A package specific license. If none is specified, it will fallback to license specified in the [`COPYING`][license] file.

## 🪄 2. Getting Started

### 2.1. Requirements

* Install [Node v20.18.0+](https://nodejs.org/en/) (LTS as of 9th November 2024)
* Install npm v8+
* Install [AlgoKit v2+](https://developer.algorand.org/docs/get-started/algokit/)

<sup>[Back to top ^][table-of-contents]</sup>

### 2.2. Installation

1. Install the dependencies using:

```shell
npm install
```

<sup>[Back to top ^][table-of-contents]</sup>

## 📑 3. Appendix

### 3.1. Packages

| Name                                                   | Description                                                       |
|--------------------------------------------------------|-------------------------------------------------------------------|
| [`contract`](./packages/pinakion-contract/README.md)   | The Kibisis Pinakion NFT contract written in TEALScript.          |
| [`js-client`](./packages/pinakion-js-client/README.md) | The JS client to interact with the Kibisis Pinakion NFT contract. |

<sup>[Back to top ^][table-of-contents]</sup>

### 3.2. Useful Commands

| Command                         | Description                                                                      |
|---------------------------------|----------------------------------------------------------------------------------|
| `npm run build:<package>`       | Builds the named package.                                                        |
| `npm run lint:<package>`        | Lints the named package.                                                         |
| `npm run prettier`              | Runs `prettier` with the same configuration that is run on the pre-commit hooks. |
| `npm run test:<package>`        | Runs the named package's tests.                                                  |

<sup>[Back to top ^][table-of-contents]</sup>

## 👏 4. How To Contribute

Please read the [**Contributing Guide**](./CONTRIBUTING.md) to learn about the development process.

<sup>[Back to top ^][table-of-contents]</sup>

## 📄 5. License

Please refer to the packages [`COPYING`][license] file.

<sup>[Back to top ^][table-of-contents]</sup>

<!-- Links -->
[license]: ./COPYING
[table-of-contents]: #table-of-contents
