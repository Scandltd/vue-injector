#!/bin/bash

cp /root/.ssh/tmp /root/.ssh/id_rsa
chmod 400 /root/.ssh/id_rsa

git config --global user.name "$GIT_USERNAME"
git config --global user.email "$GIT_EMAIL"

git config --global core.autocrlf false
git config --global core.eol lf

$@
