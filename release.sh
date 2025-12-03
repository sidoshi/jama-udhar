#!/bin/bash

npm run build

git checkout pages
mv dist/* .
rm -rf dist
git add .
git commit -m "Deploy new version"
git push origin pages