#!/bin/bash
echo APP_UPLOAD_STORE_FILE=$1 >> ~/.gradle/gradle.properties
echo APP_UPLOAD_STORE_PASSWORD=$2 >> ~/.gradle/gradle.properties
echo APP_UPLOAD_KEY_ALIAS=$3 >> ~/.gradle/gradle.properties
echo APP_UPLOAD_KEY_PASSWORD=$4 >> ~/.gradle/gradle.properties
