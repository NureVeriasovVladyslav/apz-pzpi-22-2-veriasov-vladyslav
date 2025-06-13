FROM postgres:15

RUN apt-get update && apt-get install -y cron

# Копіюємо скрипт та план
COPY backup.sh /usr/local/bin/backup.sh
COPY crontab /etc/cron.d/backup-cron

# Дозволи
RUN chmod +x /usr/local/bin/backup.sh \
    && chmod 0644 /etc/cron.d/backup-cron

# Додаємо cron job
RUN crontab /etc/cron.d/backup-cron

# Створюємо директорію для бекапів
VOLUME /backups
RUN mkdir -p /backups

# Запускаємо cron
CMD ["cron", "-f"]
