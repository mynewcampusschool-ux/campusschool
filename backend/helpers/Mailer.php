<?php
// backend/helpers/Mailer.php

declare(strict_types=1);

namespace App\Helpers;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

class Mailer
{
    private static function make(): PHPMailer
    {
        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host       = $_ENV['MAIL_HOST']     ?? 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = $_ENV['MAIL_USERNAME']  ?? '';
        $mail->Password   = $_ENV['MAIL_PASSWORD']  ?? '';
        $mail->SMTPSecure = $_ENV['MAIL_ENCRYPTION'] === 'ssl' ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = (int)($_ENV['MAIL_PORT'] ?? 587);
        $mail->CharSet    = 'UTF-8';
        $mail->setFrom(
            $_ENV['MAIL_FROM_ADDRESS'] ?? 'noreply@campusschool.in',
            $_ENV['MAIL_FROM_NAME']    ?? 'Campus School Pantnagar'
        );
        return $mail;
    }

    public static function sendVerification(string $toEmail, string $toName, string $token): bool
    {
        $frontendUrl = rtrim($_ENV['FRONTEND_URL'] ?? 'http://localhost:5173', '/');
        $link = "{$frontendUrl}/auth/verify-email?token={$token}";

        try {
            $mail = self::make();
            $mail->addAddress($toEmail, $toName);
            $mail->isHTML(true);
            $mail->Subject = 'Verify Your Email — Campus School Pantnagar Alumni Portal';
            $mail->Body    = self::verificationTemplate($toName, $link);
            $mail->AltBody = "Hi {$toName}, verify your email: {$link}";
            $mail->send();
            return true;
        } catch (Exception) {
            return false;
        }
    }

    public static function sendPasswordReset(string $toEmail, string $toName, string $token): bool
    {
        $frontendUrl = rtrim($_ENV['FRONTEND_URL'] ?? 'http://localhost:5173', '/');
        $link = "{$frontendUrl}/auth/reset-password?token={$token}";

        try {
            $mail = self::make();
            $mail->addAddress($toEmail, $toName);
            $mail->isHTML(true);
            $mail->Subject = 'Reset Your Password — Campus School Pantnagar Alumni Portal';
            $mail->Body    = self::resetTemplate($toName, $link);
            $mail->AltBody = "Hi {$toName}, reset your password: {$link}";
            $mail->send();
            return true;
        } catch (Exception) {
            return false;
        }
    }

    private static function verificationTemplate(string $name, string $link): string
    {
        return <<<HTML
        <div style="font-family:Poppins,Arial,sans-serif;max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
          <div style="background:linear-gradient(135deg,#0B6B4B,#094d36);padding:32px 24px;text-align:center;">
            <h1 style="color:#fff;margin:0;font-size:20px;font-weight:900;">Campus School Pantnagar</h1>
            <p style="color:rgba(255,255,255,0.7);margin:4px 0 0;font-size:13px;">Alumni Portal</p>
          </div>
          <div style="padding:32px 24px;">
            <h2 style="color:#111827;font-size:18px;margin:0 0 8px;">Verify Your Email</h2>
            <p style="color:#6B7280;font-size:14px;line-height:1.6;">Hi {$name}, welcome to the Campus School Pantnagar Alumni Portal! Please verify your email address to activate your account.</p>
            <div style="text-align:center;margin:28px 0;">
              <a href="{$link}" style="background:#0B6B4B;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px;display:inline-block;">Verify Email Address</a>
            </div>
            <p style="color:#9CA3AF;font-size:12px;">This link expires in 24 hours. If you did not register, ignore this email.</p>
          </div>
        </div>
        HTML;
    }

    private static function resetTemplate(string $name, string $link): string
    {
        return <<<HTML
        <div style="font-family:Poppins,Arial,sans-serif;max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #E5E7EB;">
          <div style="background:linear-gradient(135deg,#0B6B4B,#094d36);padding:32px 24px;text-align:center;">
            <h1 style="color:#fff;margin:0;font-size:20px;font-weight:900;">Campus School Pantnagar</h1>
            <p style="color:rgba(255,255,255,0.7);margin:4px 0 0;font-size:13px;">Alumni Portal</p>
          </div>
          <div style="padding:32px 24px;">
            <h2 style="color:#111827;font-size:18px;margin:0 0 8px;">Reset Your Password</h2>
            <p style="color:#6B7280;font-size:14px;line-height:1.6;">Hi {$name}, click the button below to reset your password. This link expires in 1 hour.</p>
            <div style="text-align:center;margin:28px 0;">
              <a href="{$link}" style="background:#0B6B4B;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:14px;display:inline-block;">Reset Password</a>
            </div>
            <p style="color:#9CA3AF;font-size:12px;">If you did not request this, ignore this email. Your password will not change.</p>
          </div>
        </div>
        HTML;
    }
}
