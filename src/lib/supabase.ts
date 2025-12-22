import { createClient } from '@supabase/supabase-js';


// Initialize Supabase client
// Using direct values from project configuration
const supabaseUrl = 'https://xucwvkgmytcwfczidwev.supabase.co';
const supabaseKey = 'sb_publishable_GUgbLgDf4YcvWOyncOV7tQ_YlC9kQb6';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };