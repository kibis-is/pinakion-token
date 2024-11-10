#!/usr/bin/env bash

SCRIPT_DIR=$(dirname "${0}")

source "${SCRIPT_DIR}/set_vars.sh"

# Public: Starts a local AVM network and runs the contract's client tests against it.
#
# Examples
#
#   ./scripts/test.sh
#
# Returns exit code 0 if successful.
function main {
  set_vars

  printf "%b starting localnet... \n" "${INFO_PREFIX}"

  algokit localnet start

  # compile the contracts
  npm run compile

  # generate the client
  npm run generate:client

  # run tests
  npx jest

  printf "%b stopping localnet... \n" "${INFO_PREFIX}"

  algokit localnet stop

  exit 0
}

# and so, it begins...
main
