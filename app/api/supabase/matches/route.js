import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Lazy import to avoid build-time initialization
    const { createClient } = await import('@supabase/supabase-js')
    
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ source: 'none', data: [], error: 'Supabase env vars not set' })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Try matches table first
    const { data: matches, error: matchError } = await supabase
      .from('matches')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (!matchError && matches?.length > 0) {
      return NextResponse.json({ source: 'matches', data: matches })
    }

    // Fallback: fetch profiles
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name, date_of_birth, life_path_number, chaldean_number, gender, city')
      .limit(20)

    if (!profileError && profiles?.length > 0) {
      return NextResponse.json({ source: 'profiles', data: profiles })
    }

    return NextResponse.json({ 
      source: 'none',
      matchError: matchError?.message,
      profileError: profileError?.message,
      data: []
    })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
