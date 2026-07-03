import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://losiamwzbmzgzizevwjy.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxvc2lhbXd6Ym16Z3ppemV2d2p5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1ODY5NDcsImV4cCI6MjA5ODE2Mjk0N30.AgKy9xALwFLr3vnwYswgAjGlb6A1Y5dGwzd5jflJ-hc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
