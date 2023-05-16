#!/bin/bash

for i in $(seq 1 100); do
    for j in $(seq 1 1000); do
        openssl rand -base64 4 >> "file${i}.txt"
    done
done
