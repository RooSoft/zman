# zman

Open source tool automating ZFS snapshot creation and expiration based on your scheduling needs.

## Frequency based

Snapshot creation schedule could be *hourly*, *daily* or *monthly*. Each of these frequency types can retain a given quantity of snapshots before expiring them.

# How to install

Follow these steps to install zman on your system.

## Get it

Two choices

- Download [Linux](https://github.com/RooSoft/zman/releases/download/0.1/zman-0.1.0-linux-x64.tgz), [macOS](https://github.com/RooSoft/zman/releases/download/0.1/zman-0.1.0-macos-x64.tgz) or [windows](https://github.com/RooSoft/zman/releases/download/0.1/zman-0.1.0-windows-x64.zip) version

- [Build it yourself](https://github.com/RooSoft/zman/wiki/Build)

## Install the binaries

On Linux or macOS, just copy the `zman` executable to the `/usr/local/sbin` folder. On Windows,  make sure it's in the path.

## Configure

Refer to [this scenario](https://github.com/RooSoft/zman/wiki/Scenario).

# License

The MIT License (MIT)

Copyright (c) 2019 RooSoft Computing inc.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
