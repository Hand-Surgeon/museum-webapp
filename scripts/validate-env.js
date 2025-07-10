#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const requiredEnvVars = [
  'VITE_DATA_SOURCE',
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY'
]

const optionalEnvVars = [
  'VITE_USE_LOCAL_FALLBACK',
  'VITE_API_TIMEOUT',
  'VITE_API_RETRY_COUNT',
  'VITE_ENABLE_PERFORMANCE_MONITORING',
  'VITE_ENABLE_PWA',
  'VITE_ENABLE_ANALYTICS'
]

function validateEnv() {
  const envFile = path.join(process.cwd(), '.env')
  
  if (!fs.existsSync(envFile)) {
    console.error('❌ .env file not found!')
    console.log('Create a .env file based on .env.example')
    process.exit(1)
  }

  const envContent = fs.readFileSync(envFile, 'utf-8')
  const envVars = {}
  
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=')
    if (key && value) {
      envVars[key.trim()] = value.trim()
    }
  })

  let hasErrors = false
  
  console.log('🔍 Validating environment variables...\n')
  
  // Check required variables
  requiredEnvVars.forEach(varName => {
    if (!envVars[varName]) {
      console.error(`❌ Required: ${varName} is missing`)
      hasErrors = true
    } else {
      console.log(`✅ Required: ${varName}`)
    }
  })
  
  console.log('')
  
  // Check optional variables
  optionalEnvVars.forEach(varName => {
    if (envVars[varName]) {
      console.log(`✅ Optional: ${varName}`)
    } else {
      console.log(`⚠️  Optional: ${varName} (not set)`)
    }
  })
  
  // Check data source configuration
  if (envVars['VITE_DATA_SOURCE'] === 'supabase') {
    if (!envVars['VITE_SUPABASE_URL'] || !envVars['VITE_SUPABASE_ANON_KEY']) {
      console.error('\n❌ Supabase credentials are required when VITE_DATA_SOURCE=supabase')
      hasErrors = true
    }
  }
  
  if (hasErrors) {
    console.error('\n❌ Environment validation failed!')
    process.exit(1)
  } else {
    console.log('\n✅ Environment validation passed!')
  }
}

validateEnv()