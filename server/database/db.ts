import { createClient } from '@supabase/supabase-js'

let _client: ReturnType<typeof createClient> | null = null

export function useDb() {
  if (!_client) {
    const config = useRuntimeConfig()
    _client = createClient(
      process.env.SUPABASE_URL!,
      config.supabaseServiceKey,
    )
  }
  return _client
}