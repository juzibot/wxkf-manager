#!/usr/bin/env bash
set -e

imageName='wxkf-manager'
ECR_URL=789252305933.dkr.ecr.cn-northwest-1.amazonaws.com.cn
PACKAGE_VERSION=$IMAGE_TAG

echo current package version: "$PACKAGE_VERSION"

echo docker build --build-arg PACKAGE_VERSION=$PACKAGE_VERSION -t "$imageName":"$PACKAGE_VERSION" .
docker build --build-arg PACKAGE_VERSION=$PACKAGE_VERSION -t "$imageName":"$PACKAGE_VERSION" .

aws ecr get-login-password | docker login --username AWS --password-stdin $ECR_URL

echo docker tag "$imageName":"$PACKAGE_VERSION" $ECR_URL/"$imageName":"$PACKAGE_VERSION"
docker tag "$imageName":"$PACKAGE_VERSION" $ECR_URL/"$imageName":"$PACKAGE_VERSION"

echo docker push $ECR_URL/"$imageName":"$PACKAGE_VERSION"
docker push $ECR_URL/"$imageName":"$PACKAGE_VERSION"
