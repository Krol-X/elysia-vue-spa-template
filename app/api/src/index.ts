const cliCommand = process.argv[2]

if (cliCommand === 'db:migrate' || cliCommand === 'db:seed') {
  await import('@/cli')
  process.exit(0)
}

await import('@/server')

export { }
