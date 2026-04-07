-- ============================================================
-- retoran_qr: QR Masa Takip Sistemi
-- Tablo prefix: rt_
-- ============================================================

-- 1. Subeler
CREATE TABLE rt_branches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    code TEXT NOT NULL UNIQUE,
    label_color TEXT DEFAULT '#C0392B',
    address TEXT,
    phone TEXT,
    working_hours TEXT,
    google_maps_url TEXT,
    google_review_url TEXT,
    whatsapp_number TEXT,
    instagram_url TEXT,
    website_url TEXT,
    feedback_form_url TEXT,
    logo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Masalar
CREATE TABLE rt_tables (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    branch_id UUID NOT NULL REFERENCES rt_branches(id) ON DELETE CASCADE,
    table_number INT NOT NULL,
    label TEXT,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(branch_id, table_number)
);

-- 3. QR Tarama kayitlari
CREATE TABLE rt_scans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    scanned_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    branch_id UUID NOT NULL REFERENCES rt_branches(id) ON DELETE CASCADE,
    table_id UUID REFERENCES rt_tables(id) ON DELETE SET NULL,
    device TEXT,
    os TEXT,
    browser TEXT,
    ua TEXT
);

-- 4. Link tiklanma kayitlari
CREATE TABLE rt_link_clicks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    clicked_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    scan_id UUID REFERENCES rt_scans(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES rt_branches(id) ON DELETE CASCADE,
    table_id UUID REFERENCES rt_tables(id) ON DELETE SET NULL,
    link_type TEXT NOT NULL CHECK (link_type IN ('whatsapp', 'google_review', 'instagram', 'website', 'feedback'))
);

-- 5. Geri bildirim formu
CREATE TABLE rt_feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    branch_id UUID NOT NULL REFERENCES rt_branches(id) ON DELETE CASCADE,
    table_id UUID REFERENCES rt_tables(id) ON DELETE SET NULL,
    scan_id UUID REFERENCES rt_scans(id) ON DELETE SET NULL,
    name TEXT,
    phone TEXT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false
);

-- Indexler
CREATE INDEX idx_rt_scans_branch ON rt_scans(branch_id);
CREATE INDEX idx_rt_scans_table ON rt_scans(table_id);
CREATE INDEX idx_rt_scans_at ON rt_scans(scanned_at DESC);
CREATE INDEX idx_rt_tables_branch ON rt_tables(branch_id);
CREATE INDEX idx_rt_link_clicks_branch ON rt_link_clicks(branch_id);
CREATE INDEX idx_rt_link_clicks_type ON rt_link_clicks(link_type);
CREATE INDEX idx_rt_feedback_branch ON rt_feedback(branch_id);
CREATE INDEX idx_rt_feedback_read ON rt_feedback(is_read);

-- RLS
ALTER TABLE rt_branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE rt_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE rt_scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE rt_link_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE rt_feedback ENABLE ROW LEVEL SECURITY;

-- rt_branches: herkes okuyabilir (public landing page icin)
CREATE POLICY "public_read_branches" ON rt_branches FOR SELECT TO public USING (is_active = true);
CREATE POLICY "auth_all_branches" ON rt_branches FOR ALL TO authenticated USING (true);

-- rt_tables: herkes okuyabilir
CREATE POLICY "public_read_tables" ON rt_tables FOR SELECT TO public USING (is_active = true);
CREATE POLICY "auth_all_tables" ON rt_tables FOR ALL TO authenticated USING (true);

-- rt_scans: anonim insert (tarama takibi), auth okuyabilir
CREATE POLICY "anon_insert_scans" ON rt_scans FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "auth_read_scans" ON rt_scans FOR SELECT TO authenticated USING (true);

-- rt_link_clicks: anonim insert, auth okuyabilir
CREATE POLICY "anon_insert_clicks" ON rt_link_clicks FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "auth_read_clicks" ON rt_link_clicks FOR SELECT TO authenticated USING (true);

-- rt_feedback: anonim insert, auth tam erisim
CREATE POLICY "anon_insert_feedback" ON rt_feedback FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "auth_all_feedback" ON rt_feedback FOR ALL TO authenticated USING (true);

-- updated_at otomatik guncelleme
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER rt_branches_updated_at
    BEFORE UPDATE ON rt_branches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
