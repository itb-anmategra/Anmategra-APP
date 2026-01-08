-- Custom SQL migration file, put you code below! --
CREATE OR REPLACE FUNCTION update_lembaga_member_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE anmategra_lembaga
  SET member_count = (
    SELECT COUNT(*)
    FROM anmategra_kehimpunan
    WHERE anmategra_kehimpunan.lembaga_id = COALESCE(NEW.lembaga_id, OLD.lembaga_id)
  )
  WHERE id = COALESCE(NEW.lembaga_id, OLD.lembaga_id);

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_lembaga_member_count
AFTER INSERT OR DELETE ON anmategra_kehimpunan
FOR EACH ROW
EXECUTE FUNCTION update_lembaga_member_count();

CREATE OR REPLACE FUNCTION update_event_participant_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE anmategra_event
  SET participant_count = (
    SELECT COUNT(*)
    FROM anmategra_keanggotaan
    WHERE anmategra_keanggotaan.event_id = COALESCE(NEW.event_id, OLD.event_id)
  )
  WHERE id = COALESCE(NEW.event_id, OLD.event_id);

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_event_participant_count
AFTER INSERT OR DELETE ON anmategra_keanggotaan
FOR EACH ROW
EXECUTE FUNCTION update_event_participant_count();
