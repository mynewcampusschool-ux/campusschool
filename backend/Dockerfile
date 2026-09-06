FROM php:8.2-fpm-alpine

# Install nginx + PostgreSQL PHP extension
RUN apk add --no-cache nginx curl unzip postgresql-dev \
    && docker-php-ext-install pdo pdo_pgsql

# Install composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Nginx config
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Copy backend source
WORKDIR /var/www/html
COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction --ignore-platform-reqs

# Permissions
RUN mkdir -p logs uploads/alumni uploads/files uploads/images \
    && chmod -R 775 logs uploads

# Fix line endings and copy start script
COPY docker/start.sh /start.sh
RUN sed -i 's/\r//' /start.sh && chmod +x /start.sh

EXPOSE 10000

CMD ["/bin/sh", "/start.sh"]
