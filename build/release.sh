#!/bin/bash

set -e
echo "Enter release version: "
read VERSION

release() {
  echo "Releasing $VERSION ..."
  yarn test
  VERSION=$VERSION yarn run build

  # commit
  git add -A
  git commit -m "[build] $VERSION"
  yarn version --new-version $VERSION

  # publish
  git push origin --tags
  git push
}

while true; do
  read -p "Releasing $VERSION - are you sure? (y/n)" yn
  case $yn in
    [Yy]* ) release; break;;
    [Nn]* ) exit;;
    * ) echo "Please answer yes or no.";;
  esac
done
