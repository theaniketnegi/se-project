#!/bin/bash
rm -rf ./backend/dist || exit
cd frontend/ || exit
npm install || exit
npm run build || exit
mv -f ./dist ../backend/ || exit
cd ../backend/ || exit
npm install || exit
npm run build || exit
npm run start || exit
