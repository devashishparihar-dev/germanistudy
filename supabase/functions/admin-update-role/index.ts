import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Verify caller is authenticated
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    // 2. Verify caller is an admin
    const { data: callerProfile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || callerProfile?.role !== 'admin') {
      throw new Error('Forbidden: Admin access required')
    }

    const { targetUserId, newRole } = await req.json()

    if (!targetUserId || !newRole || !['admin', 'student'].includes(newRole)) {
      throw new Error('Invalid parameters')
    }

    // 3. Prevent self-modification
    if (targetUserId === user.id) {
      throw new Error('Cannot modify your own role')
    }

    // 4. If demoting an admin, ensure they are not the last admin
    if (newRole !== 'admin') {
      // We are changing someone to non-admin
      // Let's check if they were an admin first
      const { data: targetProfile } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', targetUserId)
        .single()

      if (targetProfile?.role === 'admin') {
        const { count, error: countError } = await supabaseAdmin
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .eq('role', 'admin')

        if (countError) throw countError
        
        // Target is an admin, caller is an admin (but not the target).
        // Since caller is an admin, count is at least 2 in this scenario,
        // but let's be strictly safe:
        if (count && count <= 1) {
          throw new Error('Cannot demote the last remaining admin')
        }
      }
    }

    // 5. Apply the update using service role
    const { error: updateError } = await supabaseAdmin
      .from('profiles')
      .update({ role: newRole })
      .eq('id', targetUserId)

    if (updateError) throw updateError

    return new Response(
      JSON.stringify({ success: true, message: `Role updated to ${newRole}` }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
