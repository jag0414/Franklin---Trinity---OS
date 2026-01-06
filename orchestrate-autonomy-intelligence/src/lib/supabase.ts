import { createClient } from '@supabase/supabase-js';


// Initialize Supabase client
// Using direct values from project configuration
const supabaseUrl = 'https://xucwvkgmytcwfczidwev.supabase.co';
const supabaseKey = 'sb_publishable_FUsvfRocCp-aTAUvQIfjFQ_imGt8qML';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };