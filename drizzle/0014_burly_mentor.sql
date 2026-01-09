-- Custom SQL migration file, put you code below! --

UPDATE anmategra_mahasiswa m
SET nama = u.name
FROM anmategra_user u
WHERE m.user_id = u.id
  AND m.nama IS NULL;

CREATE OR REPLACE FUNCTION sync_mahasiswa_nama()
RETURNS TRIGGER AS $$
BEGIN
  -- Only fill nama if not explicitly provided
  IF NEW.nama IS NULL THEN
    SELECT u.name
    INTO NEW.nama
    FROM anmategra_user u
    WHERE u.id = NEW.user_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER mahasiswa_after_insert_nama
BEFORE INSERT ON anmategra_mahasiswa
FOR EACH ROW
EXECUTE FUNCTION sync_mahasiswa_nama();

