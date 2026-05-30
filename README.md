# LoveWall Frontend MVP

React-приложение для LoveWall. Минималистичный интерфейс для регистрации, авторизации, просмотра и публикации сообщений.

## Запуск

1. `yarn install`
2. Создайте `.env` с адресом backend:  
   VITE_API_AUTH_SERVICE_URL=http://localhost:8080
   VITE_API_USER_SERVICE_URL=http://localhost:8081
3. `npm run build`
3. `npm run start`

## Если вместо npm использовать yarn
npm	Yarn
npm install	yarn install
npm install [package]	yarn add [package]
npm run dev	yarn dev
npm run build	yarn build
npm run test	yarn test
npm uninstall [package]	yarn remove [package]
npm outdated	yarn outdated
npm update	yarn upgrade

## Возможности
- Регистрация и вход с JWT
- Публичная стена сообщений, публикация своих сообщений
- Страница профиля

## Зависимости
- React, React Router DOM, Axios, Vite