## Git Hook

### Flow:
1. Создаем hook-файл, в котором описываем логику проверок, и кладем его в корень репозитория.

2. Создаем скрипт, который будет переносить наш hook-файл в .git/hooks.

3. Далее добавляем в package.json команды, которые будут запускать скрипт установки хуков.

## Example

#### hook git commit

Для начала нам нужно понять список файлов, которые у нас изменяются:

```bash
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM -- '*.js' '*.jsx' '*.ts' '*.tsx')
[ -z "$STAGED_FILES" ] && exit 0
```
 
И для информативности выводим его:

 ```bash
 echo "$STAGED_FILES" | sed 's/^/  - /'
 ```

Далее запускаем проверку:

 ```bash
 ESLINT_OUTPUT=$("$ESLINT" --fix --quiet $STAGED_FILES 2>&1)
if [ $? -ne 0 ]; then
  ERRORS="${ERRORS}\n🔴 ESLint: ${ESLINT_OUTPUT}"
  HAS_ERRORS=true
fi
 ```

 #### Sharing
Из-за того, что мы не можем передать при коммите хук из .git/hooks, нам приходится хранить его в корне репозитория и затем устанавливать в .git/hooks:

 ```javascript
 const hookPath = join(__dirname, '.git', 'hooks', 'pre-commit');

 // Автоматически создать директорию, если ее нет
 mkdir(dirname(hookPath), { recursive: true });

// Собственно, само копирование
 copyFile(join(__dirname, 'git-commit-hook'), hookPath)

// Обязательно дать права на выполнение этого файла
 chmod(hookPath, 0o755)
 ```

 Самое главное добавить в package.json:

 ```json
 {
    "scripts": {
        "postinstall": "node hook-install.mjs",
        "hook-install": "node hook-install.mjs"   
    }
 }
 ```

 *hook-install* добавляем что бы оставить ручное добавление/обновление нашего хука