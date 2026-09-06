FROM php:8.2-fpm-alpine

# Install nginx + required PHP extensions
RUN apk add --no-cache nginx curl unzip \
    && docker-php-ext-install pdo pdo_mysql

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

# Start script
COPY docker/start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 10000

CMD ["/start.sh"]
