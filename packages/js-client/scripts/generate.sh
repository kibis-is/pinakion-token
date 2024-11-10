#!/usr/bin/env bash

SCRIPT_DIR=$(dirname "${0}")

source "${SCRIPT_DIR}/set_vars.sh"

# Public: Compiles the contract artifacts and generates the TypeScript source code to `src/index.ts`.
#
# Examples
#
#   ./scripts/generate.sh
#
# Returns exit code 0 if successful.
function main {
  set_vars

  # compile the contract artifacts
  npm run build npm run build --workspace=@kibisis/pinakion-contract

  printf "%b generating typescript source code... \n" "${INFO_PREFIX}"
  algokit generate client ../contract/dist/ \
    --language typescript  \
    --output src/index.ts

  exit 0
}

# and so, it begins...
main
