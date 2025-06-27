import { createClient } from '@supabase/supabase-js';


export const supabase = {
    client: createClient(
        'https://bhgrcocadwsejwodvzql.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoZ3Jjb2NhZHdzZWp3b2R2enFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MzY5NTksImV4cCI6MjA2NDIxMjk1OX0.ijFGDKECfWYBULzTDUtIJMFaAJN1N-70ygQSzMONQIg'
    ),
    async googleAuth() {
        const result = await window.electronAPI.signInWithGoogle();

        if (result.success) {
            await supabase.client.auth.setSession({
                access_token: result.token,
                refresh_token: ''
            });

            const user = await supabase.client.auth.getUser();
            console.log('✅ Пользователь вошёл:', user.data.user);
            
        } 
        else {
            alert('❌ Авторизация не удалась: ' + result.error);
        }
    }
}