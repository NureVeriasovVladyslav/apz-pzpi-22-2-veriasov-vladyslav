#!/bin/bash

# Змінні
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M")
BACKUP_FILE="/backups/e-transport-$TIMESTAMP.backup"

# Команда pg_dump
pg_dump -h postgres -U postgres -d e-transport -F c -f "$BACKUP_FILE"

# Вивід у лог
echo "Backup created at $BACKUP_FILE"