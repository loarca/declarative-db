# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.3] - 2019-11-26
### Fixed
- Refactor to use Typescript.

## [1.0.2] - 2018-08-16
### Fixed
- `initialState` now works as intended, it was always the initial state
whether there was already a file or not (issue #7).

## [1.0.1] - 2018-08-13
### Added
- Mutex protection to saving to disk.
- Smart scheduled saving.

## 1.0.0 - 2018-08-13
### Added
- Stateful database.
- `compression` option.

[Unreleased]: https://github.com/loarca/declarative-db/compare/v1.0.3...HEAD
[1.0.3]: https://github.com/loarca/declarative-db/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/loarca/declarative-db/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/loarca/declarative-db/compare/v1.0.0...v1.0.1
