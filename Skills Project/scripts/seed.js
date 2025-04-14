// Load .env variables into process.env
import dotenv from 'dotenv';
dotenv.config();

// Import required packages
import { createClient } from '@supabase/supabase-js';
import { faker } from '@faker-js/faker';

// Create a Supabase client just for this script
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Seed the "skills" table
async function seedSkills(count = 50) {
  for (let i = 0; i < count; i++) {
    const skill = {
      name: faker.hacker.noun(),
      description: faker.hacker.phrase(),
    };

    const { error } = await supabase.from('skills').insert(skill);
    if (error) {
      console.error(`❌ Error inserting skill ${i + 1}:`, error.message);
    } else {
      console.log(`✅ Skill ${i + 1} inserted: ${skill.name}`);
    }
  }
}

// Run it
seedSkills(50);
