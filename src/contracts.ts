export const CASINO = {
  "abi": [
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "keyHash",
          "type": "bytes32"
        },
        {
          "internalType": "uint16",
          "name": "minimumRequestConfirmations",
          "type": "uint16"
        },
        {
          "internalType": "uint32",
          "name": "callbackGasLimit",
          "type": "uint32"
        },
        {
          "internalType": "uint32",
          "name": "numWords",
          "type": "uint32"
        },
        {
          "internalType": "uint64",
          "name": "subId",
          "type": "uint64"
        },
        {
          "internalType": "address",
          "name": "VRFCoordinatorV2InterfaceAddress",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "have",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "want",
          "type": "address"
        }
      ],
      "name": "OnlyCoordinatorCanFulfill",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "game",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "bytes20",
          "name": "winner",
          "type": "bytes20"
        }
      ],
      "name": "CompleteGame_Event",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "id",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "host",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "gameType",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "wager",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isActive",
              "type": "bool"
            },
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "id",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "choice",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "isWinner",
                  "type": "bool"
                }
              ],
              "internalType": "struct Gambler[]",
              "name": "gamblers",
              "type": "tuple[]"
            }
          ],
          "indexed": false,
          "internalType": "struct DisplayInfo",
          "name": "game",
          "type": "tuple"
        }
      ],
      "name": "CreateGame_Event",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "game",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "requestId",
          "type": "uint256"
        }
      ],
      "name": "VrfRequest_Event",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "requestId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256[]",
          "name": "randomWords",
          "type": "uint256[]"
        }
      ],
      "name": "VrfResponse_Event",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "bankrollDeposit",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "bankrollGetBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "bankrollGetTransactionRecords",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "from",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "to",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "game",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "recordType",
              "type": "uint256"
            }
          ],
          "internalType": "struct Record[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "bankrollWithdraw",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "gameType",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "choice",
          "type": "uint256"
        }
      ],
      "name": "createGame",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "targetGame",
          "type": "address"
        }
      ],
      "name": "getGame",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "id",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "host",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "gameType",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "wager",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isActive",
              "type": "bool"
            },
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "id",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "choice",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "isWinner",
                  "type": "bool"
                }
              ],
              "internalType": "struct Gambler[]",
              "name": "gamblers",
              "type": "tuple[]"
            }
          ],
          "internalType": "struct DisplayInfo",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getGames",
      "outputs": [
        {
          "components": [
            {
              "internalType": "address",
              "name": "id",
              "type": "address"
            },
            {
              "internalType": "address",
              "name": "host",
              "type": "address"
            },
            {
              "internalType": "uint256",
              "name": "gameType",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "wager",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "isActive",
              "type": "bool"
            },
            {
              "components": [
                {
                  "internalType": "address",
                  "name": "id",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "choice",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "isWinner",
                  "type": "bool"
                }
              ],
              "internalType": "struct Gambler[]",
              "name": "gamblers",
              "type": "tuple[]"
            }
          ],
          "internalType": "struct DisplayInfo[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "targetGame",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "choice",
          "type": "uint256"
        }
      ],
      "name": "playGame",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "gameType",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "choice",
          "type": "uint256"
        }
      ],
      "name": "playGameWithDefaultHost",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "requestId",
          "type": "uint256"
        },
        {
          "internalType": "uint256[]",
          "name": "randomWords",
          "type": "uint256[]"
        }
      ],
      "name": "rawFulfillRandomWords",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ],
};
