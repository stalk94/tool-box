import { createClient } from '@supabase/supabase-js';


export const supabase = createClient(
    'https://bhgrcocadwsejwodvzql.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoZ3Jjb2NhZHdzZWp3b2R2enFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MzY5NTksImV4cCI6MjA2NDIxMjk1OX0.ijFGDKECfWYBULzTDUtIJMFaAJN1N-70ygQSzMONQIg'
);