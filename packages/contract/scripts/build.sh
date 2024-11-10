#!/usr/bin/env bash

SCRIPT_DIR=$(dirname "${0}")

source "${SCRIPT_DIR}/set_vars.sh"

# Public: Starts a local AVM network and compiles the TEAL contracts to the `dist/` directory.
#
# Examples
#
#   ./scripts/build.sh
#
# Returns exit code 0 if successful.
function main {
  set_vars

  printf "%b starting localnet... \n" "${INFO_PREFIX}"

  algokit localnet start

  # clear the dist directory
  npx shx rm -rf dist

  # create a new dist directory
  npx shx mkdir dist

  printf "%b compiling contracts... \n" "${INFO_PREFIX}"

  npx tealscript src/*.avm.ts dist

  printf "%b stopping localnet... \n" "${INFO_PREFIX}"

  algokit localnet stop

  exit 0
}

# and so, it begins...
main
