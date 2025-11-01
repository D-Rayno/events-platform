#!/bin/sh
# Typesense Health Check Script
# This script checks if Typesense is listening on port 8108

# Simple TCP port check using /dev/tcp (works in Alpine sh)
timeout 2 sh -c 'exec 3<>/dev/tcp/localhost/8108 && echo -e "GET /health HTTP/1.1\r\nHost: localhost\r\n\r\n" >&3 && grep -q "ok" <&3'
exit $?