-- Custom SQL migration file, put you code below! --

-- enable trigram search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- name search index
CREATE INDEX mahasiswa_nama_trgm_idx
ON anmategra_mahasiswa
USING gin (nama gin_trgm_ops);

-- nim finder index
CREATE INDEX mahasiswa_nim_text_idx
ON anmategra_mahasiswa ((nim::text));

-- nim TPB fallback index
CREATE INDEX mahasiswa_nim_tpb_text_idx
ON anmategra_mahasiswa ((nim_tpb::text))
WHERE nim_tpb IS NOT NULL;

-- lembaga name search index
CREATE INDEX lembaga_name_trgm_idx
ON anmategra_lembaga
USING gin (name gin_trgm_ops);

-- event name search index
CREATE INDEX event_name_trgm_idx
ON anmategra_event
USING gin (name gin_trgm_ops);
