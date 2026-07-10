import { supabase } from '../supabaseClient';

/**
 * Logs an event to the Supabase `events` table.
 * 
 * @param {string} eventName - The name of the event (e.g., 'landing_page_visit', 'mock_started')
 * @param {object} metadata - Optional metadata JSON object (e.g., { path: '/', score: 50 })
 */
export const trackEvent = async (eventName, metadata = {}) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    await supabase.from('events').insert([
      {
        user_id: user ? user.id : null,
        event_name: eventName,
        metadata: metadata
      }
    ]);
  } catch (error) {
    // Fail silently so analytics tracking never breaks the user experience
    console.error('Failed to log event:', error);
  }
};
