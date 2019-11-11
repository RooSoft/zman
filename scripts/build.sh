#! /bin/sh

npm run buildLinux
npm run buildMac
npm run buildWindows

cd dist

mv linux zman-0.1.1-linux-x64
tar zcvf zman-0.1.1-linux-x64.tgz zman-0.1.1-linux-x64

mv macos zman-0.1.1-macos-x64
tar zcvf zman-0.1.1-macos-x64.tgz zman-0.1.1-macos-x64

mv windows zman-0.1.1-windows-x64
zip zman-0.1.1-windows-x64.zip zman-0.1.1-windows-x64
