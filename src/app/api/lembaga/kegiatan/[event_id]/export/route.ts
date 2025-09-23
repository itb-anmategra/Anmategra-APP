import { eq, inArray } from 'drizzle-orm';
import ExcelJS from 'exceljs';
import { getServerAuthSession } from '~/server/auth';
import { db } from '~/server/db';
import { keanggotaan, mahasiswa, users } from '~/server/db/schema';

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
