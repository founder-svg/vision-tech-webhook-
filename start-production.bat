@echo off
title Vision Tech - WhatsApp Webhook & Simulator (Production)
echo ================================================================
echo        VISION TECH - WHATSAPP CLOUD API WEBHOOK SERVER
echo ================================================================
echo.
echo Starting Next.js Production Server on http://localhost:3000...
echo.
set PORT=3000
set NODE_ENV=production
call npx next start -p 3000
pause
