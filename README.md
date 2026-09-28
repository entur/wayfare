# OMSA Example Clients

![Status](https://img.shields.io/badge/status-WIP-purple)
![Last Commit](https://img.shields.io/github/last-commit/entur/omsa-example-clients)
![Issues](https://img.shields.io/github/issues/entur/omsa-example-clients)
![Pull Requests](https://img.shields.io/github/issues-pr/entur/omsa-example-clients)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?logo=fastapi&logoColor=white)
![Flutter](https://img.shields.io/badge/Flutter-02569B?logo=flutter&logoColor=white)

A collection of example frontends and backends-for-frontend (BFFs), each built in a different stack. They show how an operator can integrate with Entur's [Open Mobility Sales API (OMSA)](https://github.com/OMSA-Open-Mobility-Sales-API/OMSA) and Reisefrihet API.

The examples are built around **Wayfare**, a fictional operator, so the projects are closer to real operator or agent apps. Clients live under `clients/`, BFFs under `bffs/`, and setup guides for client + BFF pairings under `docs/`.

## Getting started

- Each project documents its own setup:
  - [clients/flutter/README.md](clients/flutter/README.md) covers the Flutter demo app.
  - [bffs/python-fastapi/README.md](bffs/python-fastapi/README.md) covers the FastAPI BFF.
  - [docs/react-native-fastify-guide.md](docs/react-native-fastify-guide.md) covers the Wayfare Expo app and Fastify BFF.
- Integration guides live in `docs/`. Start with [docs/flutter-fastapi-guide.md](docs/flutter-fastapi-guide.md) to run the Flutter client against the FastAPI BFF.

## Documentation

- Add new client/BFF pairings under `docs/` as `client-bff-guide.md` to keep combinations discoverable (e.g. `react-express-guide.md`).
- Official OMSA specification: <https://github.com/OMSA-Open-Mobility-Sales-API/OMSA>
- Node dependency security baseline: [docs/node-dependency-security.md](docs/node-dependency-security.md)

## Having problems?

Please [open an issue](https://github.com/entur/omsa-example-clients/issues/new/choose) if you encounter bugs or have feature requests.
