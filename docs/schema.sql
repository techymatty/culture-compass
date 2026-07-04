-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================================
-- 1. TABLES DEFINITIONS
-- =========================================================================

-- Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    clerk_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    avatar_url TEXT,
    travel_personality VARCHAR(50),
    culture_dna JSONB DEFAULT '{}'::jsonb,
    total_xp INTEGER DEFAULT 0 NOT NULL,
    level INTEGER DEFAULT 1 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Destinations Table
CREATE TABLE IF NOT EXISTS destinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    region VARCHAR(100),
    description TEXT NOT NULL,
    history_summary TEXT,
    weather_insights JSONB DEFAULT '{}'::jsonb,
    crowd_level VARCHAR(20) DEFAULT 'Medium',
    transportation_tips JSONB DEFAULT '{}'::jsonb,
    best_season VARCHAR(50),
    lat NUMERIC(10, 7) NOT NULL,
    lng NUMERIC(10, 7) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT chk_lat CHECK (lat BETWEEN -90 AND 90),
    CONSTRAINT chk_lng CHECK (lng BETWEEN -180 AND 180)
);

-- Hidden Gems Table
CREATE TABLE IF NOT EXISTS hidden_gems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    cultural_significance TEXT NOT NULL,
    lat NUMERIC(10, 7) NOT NULL,
    lng NUMERIC(10, 7) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT chk_gem_lat CHECK (lat BETWEEN -90 AND 90),
    CONSTRAINT chk_gem_lng CHECK (lng BETWEEN -180 AND 180)
);

-- Trips Table
CREATE TABLE IF NOT EXISTS trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE RESTRICT,
    title VARCHAR(150) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    budget_tier VARCHAR(20) DEFAULT 'Moderate' NOT NULL,
    travel_style VARCHAR(30) DEFAULT 'Relaxed' NOT NULL,
    sustainability_grade CHAR(1) DEFAULT 'C' NOT NULL,
    carbon_footprint_kg NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT chk_dates CHECK (start_date <= end_date)
);

-- Itinerary Days Table
CREATE TABLE IF NOT EXISTS itinerary_days (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_trip_day UNIQUE (trip_id, day_number)
);

-- Itinerary Activities Table
CREATE TABLE IF NOT EXISTS itinerary_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    itinerary_day_id UUID NOT NULL REFERENCES itinerary_days(id) ON DELETE CASCADE,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    activity_type VARCHAR(50) DEFAULT 'Sightseeing' NOT NULL,
    transport_mode VARCHAR(50) DEFAULT 'Walk',
    cost NUMERIC(10, 2) DEFAULT 0.00,
    lat NUMERIC(10, 7),
    lng NUMERIC(10, 7),
    is_completed BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT chk_times CHECK (start_time <= end_time)
);

-- User Quests Table
CREATE TABLE IF NOT EXISTS user_quests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    quest_key VARCHAR(100) NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    xp_reward INTEGER DEFAULT 50 NOT NULL,
    status VARCHAR(20) DEFAULT 'IN_PROGRESS' NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_quest UNIQUE (user_id, quest_key)
);

-- Food Passport Table
CREATE TABLE IF NOT EXISTS food_passport (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
    dish_name VARCHAR(100) NOT NULL,
    cultural_significance TEXT NOT NULL,
    photo_url TEXT,
    user_notes TEXT,
    tasted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Journal Entries Table
CREATE TABLE IF NOT EXISTS journal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    trip_id UUID REFERENCES trips(id) ON DELETE SET NULL,
    title VARCHAR(150) NOT NULL,
    raw_content TEXT NOT NULL,
    generated_narrative TEXT,
    photo_urls TEXT[] DEFAULT '{}'::text[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Emergency Contacts Table
CREATE TABLE IF NOT EXISTS emergency_contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    destination_id UUID NOT NULL UNIQUE REFERENCES destinations(id) ON DELETE CASCADE,
    local_police VARCHAR(20) DEFAULT '112' NOT NULL,
    local_ambulance VARCHAR(20) DEFAULT '112' NOT NULL,
    local_fire VARCHAR(20) DEFAULT '112' NOT NULL,
    nearest_hospital_name VARCHAR(150) NOT NULL,
    hospital_lat NUMERIC(10, 7) NOT NULL,
    hospital_lng NUMERIC(10, 7) NOT NULL,
    safety_guidelines TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================================
-- 2. INDEX DEFINITIONS
-- =========================================================================

CREATE INDEX IF NOT EXISTS idx_profiles_clerk_id ON profiles (clerk_id);
CREATE INDEX IF NOT EXISTS idx_destinations_name_country ON destinations (name, country);
CREATE INDEX IF NOT EXISTS idx_hidden_gems_coords ON hidden_gems (lat, lng);
CREATE INDEX IF NOT EXISTS idx_itinerary_activities_coords ON itinerary_activities (lat, lng);
CREATE INDEX IF NOT EXISTS idx_trips_active_user ON trips (user_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_journal_entries_active_user ON journal_entries (user_id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_hidden_gems_dest ON hidden_gems (destination_id);
CREATE INDEX IF NOT EXISTS idx_trips_dest ON trips (destination_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_days_trip ON itinerary_days (trip_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_activities_day ON itinerary_activities (itinerary_day_id);
CREATE INDEX IF NOT EXISTS idx_user_quests_user ON user_quests (user_id);
CREATE INDEX IF NOT EXISTS idx_food_passport_user_dest ON food_passport (user_id, destination_id);

-- =========================================================================
-- 3. AUDIT TRIGGERS
-- =========================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON profiles;
CREATE TRIGGER trg_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_destinations_updated_at ON destinations;
CREATE TRIGGER trg_destinations_updated_at BEFORE UPDATE ON destinations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_trips_updated_at ON trips;
CREATE TRIGGER trg_trips_updated_at BEFORE UPDATE ON trips FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_itinerary_days_updated_at ON itinerary_days;
CREATE TRIGGER trg_itinerary_days_updated_at BEFORE UPDATE ON itinerary_days FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_itinerary_activities_updated_at ON itinerary_activities;
CREATE TRIGGER trg_itinerary_activities_updated_at BEFORE UPDATE ON itinerary_activities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_user_quests_updated_at ON user_quests;
CREATE TRIGGER trg_user_quests_updated_at BEFORE UPDATE ON user_quests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_journal_entries_updated_at ON journal_entries;
CREATE TRIGGER trg_journal_entries_updated_at BEFORE UPDATE ON journal_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trg_emergency_contacts_updated_at ON emergency_contacts;
CREATE TRIGGER trg_emergency_contacts_updated_at BEFORE UPDATE ON emergency_contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =========================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE hidden_gems ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_passport ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "Allow select for all profiles" ON profiles;
CREATE POLICY "Allow select for all profiles" ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow update for own profile" ON profiles;
CREATE POLICY "Allow update for own profile" ON profiles FOR UPDATE USING (clerk_id = auth.jwt()->>'sub') WITH CHECK (clerk_id = auth.jwt()->>'sub');

DROP POLICY IF EXISTS "Allow insert for own profile" ON profiles;
CREATE POLICY "Allow insert for own profile" ON profiles FOR INSERT WITH CHECK (clerk_id = auth.jwt()->>'sub');

-- Destinations Policies (Read-only for users)
DROP POLICY IF EXISTS "Allow read destinations for all" ON destinations;
CREATE POLICY "Allow read destinations for all" ON destinations FOR SELECT USING (true);

-- Hidden Gems Policies (Read-only for users)
DROP POLICY IF EXISTS "Allow read hidden gems for all" ON hidden_gems;
CREATE POLICY "Allow read hidden gems for all" ON hidden_gems FOR SELECT USING (true);

-- Trips Policies
DROP POLICY IF EXISTS "Allow users select own active trips" ON trips;
CREATE POLICY "Allow users select own active trips" ON trips FOR SELECT USING (user_id IN (SELECT id FROM profiles WHERE clerk_id = auth.jwt()->>'sub') AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Allow users insert own trips" ON trips;
CREATE POLICY "Allow users insert own trips" ON trips FOR INSERT WITH CHECK (user_id IN (SELECT id FROM profiles WHERE clerk_id = auth.jwt()->>'sub'));

DROP POLICY IF EXISTS "Allow users update own trips" ON trips;
CREATE POLICY "Allow users update own trips" ON trips FOR UPDATE USING (user_id IN (SELECT id FROM profiles WHERE clerk_id = auth.jwt()->>'sub')) WITH CHECK (user_id IN (SELECT id FROM profiles WHERE clerk_id = auth.jwt()->>'sub'));

-- Itinerary Days Policies
DROP POLICY IF EXISTS "Allow select days of own trips" ON itinerary_days;
CREATE POLICY "Allow select days of own trips" ON itinerary_days FOR SELECT USING (trip_id IN (SELECT id FROM trips WHERE user_id IN (SELECT id FROM profiles WHERE clerk_id = auth.jwt()->>'sub')));

DROP POLICY IF EXISTS "Allow insert days of own trips" ON itinerary_days;
CREATE POLICY "Allow insert days of own trips" ON itinerary_days FOR INSERT WITH CHECK (trip_id IN (SELECT id FROM trips WHERE user_id IN (SELECT id FROM profiles WHERE clerk_id = auth.jwt()->>'sub')));

DROP POLICY IF EXISTS "Allow update days of own trips" ON itinerary_days;
CREATE POLICY "Allow update days of own trips" ON itinerary_days FOR UPDATE USING (trip_id IN (SELECT id FROM trips WHERE user_id IN (SELECT id FROM profiles WHERE clerk_id = auth.jwt()->>'sub')));

-- Itinerary Activities Policies
DROP POLICY IF EXISTS "Allow select activities of own trips" ON itinerary_activities;
CREATE POLICY "Allow select activities of own trips" ON itinerary_activities FOR SELECT USING (itinerary_day_id IN (SELECT id FROM itinerary_days WHERE trip_id IN (SELECT id FROM trips WHERE user_id IN (SELECT id FROM profiles WHERE clerk_id = auth.jwt()->>'sub'))));

DROP POLICY IF EXISTS "Allow insert activities of own trips" ON itinerary_activities;
CREATE POLICY "Allow insert activities of own trips" ON itinerary_activities FOR INSERT WITH CHECK (itinerary_day_id IN (SELECT id FROM itinerary_days WHERE trip_id IN (SELECT id FROM trips WHERE user_id IN (SELECT id FROM profiles WHERE clerk_id = auth.jwt()->>'sub'))));

DROP POLICY IF EXISTS "Allow update activities of own trips" ON itinerary_activities;
CREATE POLICY "Allow update activities of own trips" ON itinerary_activities FOR UPDATE USING (itinerary_day_id IN (SELECT id FROM itinerary_days WHERE trip_id IN (SELECT id FROM trips WHERE user_id IN (SELECT id FROM profiles WHERE clerk_id = auth.jwt()->>'sub'))));

-- User Quests Policies
DROP POLICY IF EXISTS "Allow select own quests" ON user_quests;
CREATE POLICY "Allow select own quests" ON user_quests FOR SELECT USING (user_id IN (SELECT id FROM profiles WHERE clerk_id = auth.jwt()->>'sub'));

DROP POLICY IF EXISTS "Allow insert own quests" ON user_quests;
CREATE POLICY "Allow insert own quests" ON user_quests FOR INSERT WITH CHECK (user_id IN (SELECT id FROM profiles WHERE clerk_id = auth.jwt()->>'sub'));

DROP POLICY IF EXISTS "Allow update own quests" ON user_quests;
CREATE POLICY "Allow update own quests" ON user_quests FOR UPDATE USING (user_id IN (SELECT id FROM profiles WHERE clerk_id = auth.jwt()->>'sub'));

-- Food Passport Policies
DROP POLICY IF EXISTS "Allow select own stamps" ON food_passport;
CREATE POLICY "Allow select own stamps" ON food_passport FOR SELECT USING (user_id IN (SELECT id FROM profiles WHERE clerk_id = auth.jwt()->>'sub'));

DROP POLICY IF EXISTS "Allow insert own stamps" ON food_passport;
CREATE POLICY "Allow insert own stamps" ON food_passport FOR INSERT WITH CHECK (user_id IN (SELECT id FROM profiles WHERE clerk_id = auth.jwt()->>'sub'));

-- Journal Entries Policies
DROP POLICY IF EXISTS "Allow select own journal entries" ON journal_entries;
CREATE POLICY "Allow select own journal entries" ON journal_entries FOR SELECT USING (user_id IN (SELECT id FROM profiles WHERE clerk_id = auth.jwt()->>'sub') AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Allow insert own journal entries" ON journal_entries;
CREATE POLICY "Allow insert own journal entries" ON journal_entries FOR INSERT WITH CHECK (user_id IN (SELECT id FROM profiles WHERE clerk_id = auth.jwt()->>'sub'));

DROP POLICY IF EXISTS "Allow update own journal entries" ON journal_entries;
CREATE POLICY "Allow update own journal entries" ON journal_entries FOR UPDATE USING (user_id IN (SELECT id FROM profiles WHERE clerk_id = auth.jwt()->>'sub')) WITH CHECK (user_id IN (SELECT id FROM profiles WHERE clerk_id = auth.jwt()->>'sub'));

-- Emergency Contacts Policies (Read-only for all)
DROP POLICY IF EXISTS "Allow read contacts for all" ON emergency_contacts;
CREATE POLICY "Allow read contacts for all" ON emergency_contacts FOR SELECT USING (true);
