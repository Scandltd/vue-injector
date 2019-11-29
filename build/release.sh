#!/bin/bash

set -e
echo "Enter release version: "
read VERSION

commit() {
  git add dist/*
  git commit -m "[build] $VERSION"
  yarn version --new-version $VERSION
}

publish() {
  git push $1 --tags
  git push
}

confirmRelease() {
  read -p "Releasing $VERSION - are you sure? (y/n)" yn
  case $yn in
    [Yy]* ) release; break;;
    [Nn]* ) exit;;
    * ) echo "Please answer yes or no.";;
  esac
}

confirmRemote() {
  linenum=1
  remotes=(origin)
  r=$(git remote)

  echo "Remotes:"
  while read remote ; do
    remotes+=($remote)
    echo $linenum: $remote
    linenum=$((linenum+1))
  done <<< "$r"

  read -p "What remote do you want to use? " remotenum
  publish ${remotes[$remotenum]}
}

confirmPush() {
  read -p "Do you want to push release to remote? (y/n)" yn
  case $yn in
    [Yy]* ) confirmRemote; break;;
    [Nn]* ) exit;;
    * ) echo "Please answer yes or no.";;
  esac
}

release() {
  echo "Releasing $VERSION ..."
  yarn test
  VERSION=$VERSION yarn run build

  commit
  confirmPush
}

while true; do
  confirmRelease
done
