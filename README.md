1. Install dependencies:
   `npm install`
2. Run the app:
   `npm run dev`
## ⚠️ Примечания

При установке или запуске проекта могут возникнуть ошибки, связанные с версиями зависимостей.

Если `npm install` выдаёт ошибку `ERESOLVE`, попробуйте:

```bash
npm install --legacy-peer-deps
```

Если появляется ошибка `tsx is not recognized`:

```bash
npm install -D tsx
```

Для запуска проекта используйте:

```bash
npm run dev
```

Если сайт показывает белый экран — проверьте ошибки в консоли браузера (`F12 → Console`) и убедитесь, что все зависимости установлены.
