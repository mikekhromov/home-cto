## Git Hook

### flow
1. Создаем hook фаил где описываем логику проверок и кладем его в корень репозитория

2. Создаем скрипт который будет переносить наш hook фаил в .git/hooks

3. Далее добавдяем в package.json команды которые будут запускать скрипт установки хуков

### example

#### hook git commit

Для начала нам нужно понять список файлов которые у нас изменяються

```bash
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM -- '*.js' '*.jsx' '*.ts' '*.tsx')
[ -z "$STAGED_FILES" ] && exit 0
```
 
 и для информативности выводим его

 ```bash
 echo "$STAGED_FILES" | sed 's/^/  - /'
 ```

 Ну а далее запускаем проверку

 ```bash
 ESLINT_OUTPUT=$("$ESLINT" --fix --quiet $STAGED_FILES 2>&1)
if [ $? -ne 0 ]; then
  ERRORS="${ERRORS}\n🔴 ESLint: ${ESLINT_OUTPUT}"
  HAS_ERRORS=true
fi
 ```

 #### sharing
 Из-за того что мы не можем передать при коммите хук из .git/hooks нам приходться хранить его в корне а потом утсанавливать в .git/hooks

 ```javascript
 const hookPath = join(__dirname, '.git', 'hooks', 'pre-commit');

 // Автоматически создлать директорию если ее нет
 mkdir(dirname(hookPath), { recursive: true });

// Собственно само копирование
 copyFile(join(__dirname, 'git-commit-hook'), hookPath)

// Обязательно раздать права на выполнение этого файла
 chmod(hookPath, 0o755)
 ```