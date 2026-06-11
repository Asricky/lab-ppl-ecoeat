@echo off
rmdir /s /q "app\tasks"
rmdir /s /q "app\history"
rmdir /s /q "app\earnings"
rmdir /s /q "app\settings"
del /q "app\dashboard\page.tsx"
echo Done
