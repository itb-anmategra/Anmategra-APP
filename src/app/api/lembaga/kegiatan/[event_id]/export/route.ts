import { and, eq, inArray } from 'drizzle-orm';
import ExcelJS from 'exceljs';
import { getServerAuthSession } from '~/server/auth';
import { db } from '~/server/db';
import {
  keanggotaan,
  mahasiswa,
  nilaiProfilKegiatan,
  profilKegiatan,
  users,
} from '~/server/db/schema';

export async function GET(
  request: Request,
  { params }: { params: { event_id: string } },
) {
  // --- Auth check ---
  const session = await getServerAuthSession();
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (session.user.role !== 'lembaga') {
    return Response.json({ error: 'Forbidden Resource' }, { status: 403 });
  }

  const { event_id } = params;
  if (!event_id) {
    return Response.json({ error: 'Missing event_id' }, { status: 400 });
  }

  // --- Validate lembaga ownership ---
  const userLembaga = await db.query.lembaga.findFirst({
    where: (l, { eq }) => eq(l.userId, session.user.id),
  });
  if (!userLembaga) {
    return Response.json({ error: 'Lembaga not found' }, { status: 404 });
  }

  // --- Validate event ---
  const kegiatan = await db.query.events.findFirst({
    where: (e, { eq }) => eq(e.id, event_id),
  });
  if (!kegiatan) {
    return Response.json({ error: 'Event not found' }, { status: 404 });
  }
  if (kegiatan.org_id !== userLembaga.id) {
    return Response.json({ error: 'Forbidden Resource' }, { status: 403 });
  }

  // --- Fetch panitia data ---
  const panitiaKegiatan = await db
    .select()
    .from(keanggotaan)
    .leftJoin(users, eq(keanggotaan.user_id, users.id))
    .leftJoin(mahasiswa, eq(keanggotaan.user_id, mahasiswa.userId))
    .where(eq(keanggotaan.event_id, event_id))
    .orderBy(
      keanggotaan.division,
      keanggotaan.position,
      mahasiswa.nim,
      users.name,
    );

  // --- Fetch profil kegiatan data ---
  const profilKegiatanList = await db.query.profilKegiatan.findMany({
    where: (p, { eq }) => eq(p.eventId, event_id),
  });

  // --- Fetch nilai profil data for all members ---
  const nilaiProfilData =
    profilKegiatanList.length > 0
      ? await db.query.nilaiProfilKegiatan.findMany({
          where: (n, { inArray }) =>
            inArray(
              n.profilId,
              profilKegiatanList.map((p) => p.id),
            ),
          with: {
            mahasiswa: {
              with: {
                users: true,
              },
            },
            profilKegiatan: true,
          },
        })
      : [];

  // --- Build Excel workbook ---
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Panitia Kegiatan');

  // --- Add headers ---
  const headers = ['Nama', 'NIM', 'Divisi', 'Posisi'];
  const headerRow = sheet.addRow(headers);

  // --- Style headers ---
  headerRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  });

  // --- Add data rows ---
  panitiaKegiatan.forEach((panitia) => {
    const row = sheet.addRow([
      panitia.user?.name ?? '',
      panitia.mahasiswa?.nim ?? '',
      panitia.keanggotaan.division ?? '',
      panitia.keanggotaan.position ?? 'Anggota',
    ]);

    // --- Add borders to data rows ---
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
  });

  // --- Auto-adjust column widths for first sheet ---
  sheet.columns.forEach((column) => {
    let maxLength = 0;
    column.eachCell?.({ includeEmpty: true }, (cell) => {
      const value =
        typeof cell.value === 'object' && cell.value !== null
          ? JSON.stringify(cell.value)
          : (cell.value ?? '');
      const columnLength = value.toString().length || 10;
      if (columnLength > maxLength) {
        maxLength = columnLength;
      }
    });
    column.width = maxLength < 10 ? 10 : maxLength + 2;
  });

  // --- Create second sheet for Nilai Anggota ---
  const nilaiSheet = workbook.addWorksheet('Nilai Anggota');

  // --- Create dynamic headers: Nama, NIM, then all profil names ---
  const nilaiHeaders = [
    'Nama',
    'NIM',
    ...profilKegiatanList.map((p) => p.name),
  ];
  const nilaiHeaderRow = nilaiSheet.addRow(nilaiHeaders);

  // --- Style nilai headers ---
  nilaiHeaderRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
  });

  // --- Get unique members from panitia kegiatan ---
  const uniqueMembers = panitiaKegiatan.reduce(
    (acc, panitia) => {
      const userId = panitia.user?.id;
      if (userId && !acc.some((member) => member.user?.id === userId)) {
        acc.push(panitia);
      }
      return acc;
    },
    [] as typeof panitiaKegiatan,
  );

  // --- Add nilai data rows ---
  uniqueMembers.forEach((member) => {
    if (!member.user || !member.mahasiswa) return;

    const rowData = [
      member.user.name ?? '',
      member.mahasiswa.nim?.toString() ?? '',
    ];

    // --- Add nilai for each profil ---
    profilKegiatanList.forEach((profil) => {
      const nilai = nilaiProfilData.find(
        (n) =>
          n.mahasiswa.userId === member.user?.id &&
          n.profilKegiatan.id === profil.id,
      );
      rowData.push(nilai?.nilai?.toString() ?? '0');
    });

    const nilaiRow = nilaiSheet.addRow(rowData);

    // --- Add borders to nilai data rows ---
    nilaiRow.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
  });

  // --- Auto-adjust column widths for nilai sheet ---
  nilaiSheet.columns.forEach((column) => {
    let maxLength = 0;
    column.eachCell?.({ includeEmpty: true }, (cell) => {
      const value =
        typeof cell.value === 'object' && cell.value !== null
          ? JSON.stringify(cell.value)
          : (cell.value ?? '');
      const columnLength = value.toString().length || 10;
      if (columnLength > maxLength) {
        maxLength = columnLength;
      }
    });
    column.width = maxLength < 10 ? 10 : maxLength + 2;
  });

  // --- Write buffer ---
  const buffer = await workbook.xlsx.writeBuffer();

  // --- Return file response ---
  return new Response(buffer, {
    status: 200,
    headers: {
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename=panitia-${kegiatan.name || event_id}.xlsx`,
    },
  });
}

export async function POST(
  request: Request,
  { params }: { params: { event_id: string } },
) {
  // --- Auth check ---
  const session = await getServerAuthSession();
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (session.user.role !== 'lembaga') {
    return Response.json({ error: 'Forbidden Resource' }, { status: 403 });
  }

  const { event_id } = params;
  if (!event_id) {
    return Response.json({ error: 'Missing event_id' }, { status: 400 });
  }

  // --- Validate lembaga ownership ---
  const userLembaga = await db.query.lembaga.findFirst({
    where: (l, { eq }) => eq(l.userId, session.user.id),
  });
  if (!userLembaga) {
    return Response.json({ error: 'Lembaga not found' }, { status: 404 });
  }

  // --- Validate event ---
  const kegiatan = await db.query.events.findFirst({
    where: (e, { eq }) => eq(e.id, event_id),
  });
  if (!kegiatan) {
    return Response.json({ error: 'Event not found' }, { status: 404 });
  }
  if (kegiatan.org_id !== userLembaga.id) {
    return Response.json({ error: 'Forbidden Resource' }, { status: 403 });
  }

  try {
    // --- Parse form data to get the Excel file ---
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return Response.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!(/\.(xlsx|xls)$/.exec(file.name))) {
      return Response.json(
        {
          error:
            'Invalid file format. Please upload Excel file (.xlsx or .xls)',
        },
        { status: 400 },
      );
    }

    // --- Read Excel file ---
    const buffer = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);

    // --- Get worksheets ---
    const panitiaSheet = workbook.getWorksheet('Panitia Kegiatan');
    const nilaiSheet = workbook.getWorksheet('Nilai Anggota');

    if (!panitiaSheet) {
      return Response.json(
        { error: 'Required worksheet "Panitia Kegiatan" not found' },
        { status: 400 },
      );
    }

    // --- Delete existing data for this event ---
    await db.transaction(async (tx) => {
      // First delete nilai profil data
      const existingKeanggotaan = await tx.query.keanggotaan.findMany({
        where: eq(keanggotaan.event_id, event_id),
        columns: { user_id: true },
      });

      if (existingKeanggotaan.length > 0) {
        const userIds = existingKeanggotaan.map((k) => k.user_id);
        const profilIds = await tx.query.profilKegiatan.findMany({
          where: eq(profilKegiatan.eventId, event_id),
          columns: { id: true },
        });

        if (profilIds.length > 0) {
          await tx.delete(nilaiProfilKegiatan).where(
            and(
              inArray(
                nilaiProfilKegiatan.profilId,
                profilIds.map((p) => p.id),
              ),
              inArray(nilaiProfilKegiatan.mahasiswaId, userIds),
            ),
          );
        }
      }

      // Then delete keanggotaan data
      await tx.delete(keanggotaan).where(eq(keanggotaan.event_id, event_id));
    });

    // --- Process Panitia Kegiatan sheet ---
    const panitiaData: Array<{
      nama: string;
      nim: string;
      divisi: string;
      posisi: string;
    }> = [];

    panitiaSheet.eachRow((row, rowNumber) => {
      // Skip header row
      if (rowNumber === 1) return;

      const nama = row.getCell(1).text?.trim();
      const nim = row.getCell(2).text?.trim();
      const divisi = row.getCell(3).text?.trim();
      const posisi = row.getCell(4).text?.trim();

      // Skip empty rows
      if (!nama && !nim && !divisi && !posisi) return;

      if (!nama || !nim || !divisi || !posisi) {
        throw new Error(
          `Row ${rowNumber}: Missing required data (Nama, NIM, Divisi, Posisi)`,
        );
      }

      panitiaData.push({ nama, nim, divisi, posisi });
    });

    if (panitiaData.length === 0) {
      return Response.json(
        { error: 'No panitia data found in Excel file' },
        { status: 400 },
      );
    }

    // --- Find or create users and insert keanggotaan ---
    const insertedKeanggotaan: Array<{
      user_id: string;
      nama: string;
      nim: string;
    }> = [];

    for (const panitia of panitiaData) {
      // Find mahasiswa by NIM
      const mahasiswaRecord = await db.query.mahasiswa.findFirst({
        where: eq(mahasiswa.nim, parseInt(panitia.nim)),
        with: {
          users: true,
        },
      });

      if (!mahasiswaRecord) {
        throw new Error(
          `Student with NIM ${panitia.nim} not found in database`,
        );
      }

      // Insert keanggotaan
      const keanggotaanId = crypto.randomUUID();
      await db.insert(keanggotaan).values({
        id: keanggotaanId,
        event_id: event_id,
        user_id: mahasiswaRecord.userId,
        position: panitia.posisi,
        division: panitia.divisi,
        description: null,
      });

      insertedKeanggotaan.push({
        user_id: mahasiswaRecord.userId,
        nama: panitia.nama,
        nim: panitia.nim,
      });
    }

    // --- Process Nilai Anggota sheet (if exists) ---
    let processedNilaiCount = 0;
    if (nilaiSheet) {
      // Get profil kegiatan for this event
      const profilKegiatanList = await db.query.profilKegiatan.findMany({
        where: eq(profilKegiatan.eventId, event_id),
      });

      if (profilKegiatanList.length > 0) {
        // Get header row to map profil columns
        const headerRow = nilaiSheet.getRow(1);
        const profilColumnMap: Record<string, number> = {};

        headerRow.eachCell((cell, colNumber) => {
          const cellText = cell.text?.trim();
          if (cellText && colNumber > 2) {
            // Skip Nama and NIM columns
            const matchingProfil = profilKegiatanList.find(
              (p) => p.name === cellText,
            );
            if (matchingProfil) {
              profilColumnMap[matchingProfil.id] = colNumber;
            }
          }
        });

        // Process data rows
        for (let rowNumber = 2; rowNumber <= nilaiSheet.rowCount; rowNumber++) {
          const row = nilaiSheet.getRow(rowNumber);

          const nama = row.getCell(1).text?.trim();
          const nim = row.getCell(2).text?.trim();

          // Skip empty rows
          if (!nama && !nim) continue;

          if (!nim) {
            throw new Error(`Row ${rowNumber} in Nilai sheet: Missing NIM`);
          }

          // Find corresponding user from inserted keanggotaan
          const member = insertedKeanggotaan.find((k) => k.nim === nim);
          if (!member) {
            console.warn(
              `Warning: NIM ${nim} in Nilai sheet not found in Panitia sheet, skipping...`,
            );
            continue;
          }

          // Insert nilai for each profil
          for (const profil of profilKegiatanList) {
            const colNumber = profilColumnMap[profil.id];
            if (colNumber) {
              const nilaiText = row.getCell(colNumber).text?.trim();
              const nilaiValue = nilaiText ? parseInt(nilaiText) : 0;

              if (!isNaN(nilaiValue)) {
                await db.insert(nilaiProfilKegiatan).values({
                  id: crypto.randomUUID(),
                  profilId: profil.id,
                  mahasiswaId: member.user_id,
                  nilai: nilaiValue,
                });
                processedNilaiCount++;
              }
            }
          }
        }
      }
    }

    return Response.json(
      {
        success: true,
        message: `Successfully imported data`,
        data: {
          panitiaImported: insertedKeanggotaan.length,
          nilaiImported: processedNilaiCount,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error importing Excel data:', error);
    return Response.json(
      {
        error: 'Failed to import Excel data',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
