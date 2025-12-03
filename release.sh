#!/bin/bash

npm run build

git checkout pages
rm -rf assets/ index.html
mv dist/* .
rm -rf dist
git add .
git commit -m "Deploy new version"
git push origin pages
git checkout -