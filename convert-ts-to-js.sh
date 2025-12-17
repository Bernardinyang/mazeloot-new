#!/bin/bash
# Simple script to help identify TypeScript files that need conversion
find src -name "*.ts" -type f | grep -v node_modules | sort
