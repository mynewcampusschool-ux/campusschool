<?php
// backend/helpers/Validator.php

declare(strict_types=1);

namespace App\Helpers;

class Validator
{
    private array $errors = [];

    public function required(string $field, mixed $value): self
    {
        if ($value === null || trim((string)$value) === '') {
            $this->errors[$field] = ucfirst(str_replace('_', ' ', $field)) . ' is required.';
        }
        return $this;
    }

    public function email(string $field, mixed $value): self
    {
        if ($value && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
            $this->errors[$field] = 'Invalid email address.';
        }
        return $this;
    }

    public function minLength(string $field, mixed $value, int $min): self
    {
        if ($value && mb_strlen((string)$value) < $min) {
            $this->errors[$field] = ucfirst(str_replace('_', ' ', $field)) . " must be at least {$min} characters.";
        }
        return $this;
    }

    public function maxLength(string $field, mixed $value, int $max): self
    {
        if ($value && mb_strlen((string)$value) > $max) {
            $this->errors[$field] = ucfirst(str_replace('_', ' ', $field)) . " must not exceed {$max} characters.";
        }
        return $this;
    }

    public function strongPassword(string $field, mixed $value): self
    {
        $v = (string)$value;
        if ($v && (
            mb_strlen($v) < 8 ||
            !preg_match('/[A-Z]/', $v) ||
            !preg_match('/[a-z]/', $v) ||
            !preg_match('/[0-9]/', $v)
        )) {
            $this->errors[$field] = 'Password must be at least 8 characters with uppercase, lowercase and number.';
        }
        return $this;
    }

    public function fails(): bool
    {
        return !empty($this->errors);
    }

    public function errors(): array
    {
        return $this->errors;
    }

    public static function sanitize(mixed $value): string
    {
        return htmlspecialchars(strip_tags(trim((string)$value)), ENT_QUOTES, 'UTF-8');
    }
}
