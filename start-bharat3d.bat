@echo off
title Bharat 3D - Interactive Geographic Intelligence Platform
cd /d "C:\Users\ritur\Downloads\INTERACTIVE INDIA 3D DATA\bharat3d-app"
echo ====================================================
echo Starting Bharat 3D Geographic Intelligence Platform...
echo ====================================================
echo Opening http://localhost:5173
start http://localhost:5173
pnpm run dev
pause
