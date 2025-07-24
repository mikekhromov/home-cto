async function installHook() {
    const hookPath = join(__dirname, '.git', 'hooks', 'pre-commit')
    await mkdir(dirname(hookPath), { recursive: true })
    await copyFile(join(__dirname, 'git-commit-hook'), hookPath)
    await chmod(hookPath, 0o755)
    console.log('✅ Pre-commit хук установлен');
}