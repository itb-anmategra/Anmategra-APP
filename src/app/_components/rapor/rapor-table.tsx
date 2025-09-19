'use client';

import React, { useState } from 'react';
import { Table, TableBody } from '~/components/ui/table';
import { useToast } from '~/hooks/use-toast';

import DeleteProfilDialog from './delete-profil-dialog';
import EditNilaiButton from './edit-nilai-button';
import LinkButton from './link-button';
import Pagination from './pagination-comp';
import ProfilDialog from './profil-dialog';
import RaporTableHeader from './rapor-table-header';
import RaporTableRow from './rapor-table-row';
import TambahProfilButton from './tambah-profil-button';

type Anggota = { nama: string; nim: string; profil: string[] };
type ProfilData = { label: string; deskripsi: string; pemetaan: string };

interface TableProps {
  data: Anggota[];
  profil: ProfilData[];
  selectOptions: { value: string; label: string }[];
}

export default function RaporTable({
  data: anggotaList,
  profil: profilList = [],
  selectOptions,
}: TableProps) {
  const { toast } = useToast();

  const [data, setData] = useState<Anggota[]>(anggotaList);
  const [profilHeaders, setProfilHeaders] = useState<ProfilData[]>(profilList);
  const [menu, setMenu] = useState<{ row: number; col: number } | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'tambah' | 'edit'>('tambah');
  const [editColIdx, setEditColIdx] = useState<number | null>(null);

  // Form state for modal
  const [profil, setProfil] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [pemetaan, setPemetaan] = useState('');

  // Error state for form validation
  const [profilError, setProfilError] = useState<string | null>(null);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteColIdx, setDeleteColIdx] = useState<number | null>(null);

  const [editNilaiMode, setEditNilaiMode] = useState(false);
  const [editedData, setEditedData] = useState<Anggota[] | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6; // Number of rows per page

  const totalPages = Math.ceil(data.length / pageSize);
  const paginatedData = (editNilaiMode ? (editedData ?? data) : data).slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // Handlers for profil columns
  const handleTambahProfil = () => {
    setModalType('tambah');
    setProfil('');
    setDeskripsi('');
    setPemetaan('');
    setModalOpen(true);
    setMenu(null);
    setEditColIdx(null);
  };

  const handleEditProfil = (colIdx: number) => {
    setModalType('edit');
    setProfil(profilHeaders[colIdx]?.label ?? '');
    setDeskripsi(profilHeaders[colIdx]?.deskripsi ?? '');
    setPemetaan(profilHeaders[colIdx]?.pemetaan ?? '');
    setModalOpen(true);
    setMenu(null);
    setEditColIdx(colIdx);
  };

  const handleDeleteProfil = (colIdx: number) => {
    setDeleteColIdx(colIdx);
    setConfirmDeleteOpen(true);
    setMenu(null);
  };

  const handleConfirmDelete = () => {
    if (deleteColIdx === null) return;
    setProfilHeaders((prev) => prev.filter((_, i) => i !== deleteColIdx));
    setData((prev) =>
      prev.map((row) => ({
        ...row,
        profil: row.profil.filter((_, i) => i !== deleteColIdx),
      })),
    );
    setDeleteColIdx(null);
    setConfirmDeleteOpen(false);
  };

  const handleCancelDelete = () => {
    setDeleteColIdx(null);
    setConfirmDeleteOpen(false);
  };

  const handleSimpanTambah = () => {
    if (!profil.trim() || !pemetaan.trim()) {
      toast({
        title: 'Gagal menyimpan',
        description: 'Nama profil dan pemetaan tidak boleh kosong',
        variant: 'destructive',
      });
      return;
    }

    setProfilHeaders((prev) => [
      ...prev,
      {
        label: profil ?? `Profil ${prev.length + 1}`,
        deskripsi,
        pemetaan,
      },
    ]);
    setData((prev) =>
      prev.map((row) => ({
        ...row,
        profil: [...row.profil, ''],
      })),
    );
    setModalOpen(false);
  };

  const handleSimpanEdit = () => {
    if (!profil.trim() || !pemetaan.trim()) {
      toast({
        title: 'Gagal menyimpan',
        description: 'Nama profil dan pemetaan tidak boleh kosong',
        variant: 'destructive',
      });
      return;
    }

    if (editColIdx === null) return;
    setProfilHeaders((prev) =>
      prev.map((header, idx) =>
        idx === editColIdx ? { label: profil, deskripsi, pemetaan } : header,
      ),
    );
    setModalOpen(false);
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1">
        <div className="flex justify-between mb-4">
          <div className="flex gap-x-5">
            <TambahProfilButton onClick={handleTambahProfil}>
              Tambah Profil Lembaga
            </TambahProfilButton>
            <LinkButton href="">Profil Lembaga</LinkButton>
          </div>
          <EditNilaiButton
            editNilaiMode={editNilaiMode}
            setEditNilaiMode={setEditNilaiMode}
            editedData={editedData}
            setData={setData}
            setEditedData={setEditedData}
            data={data}
          />
        </div>
        <div className="w-full overflow-x-auto">
          <Table className="min-w-max">
            <RaporTableHeader
              profilHeaders={profilHeaders}
              menu={menu}
              setMenu={setMenu}
              handleEditProfil={handleEditProfil}
              handleDeleteProfil={handleDeleteProfil}
            />
            <TableBody>
              {paginatedData.map((row, rowIdx) => {
                const absoluteRowIdx = (currentPage - 1) * pageSize + rowIdx;
                return (
                  <RaporTableRow
                    key={rowIdx}
                    row={row}
                    editNilaiMode={editNilaiMode}
                    editedData={editedData}
                    setEditedData={setEditedData}
                    absoluteRowIdx={absoluteRowIdx}
                  />
                );
              })}
            </TableBody>
          </Table>
        </div>
        <ProfilDialog
          open={modalOpen}
          setOpen={setModalOpen}
          modalType={modalType}
          profil={profil}
          setProfil={setProfil}
          deskripsi={deskripsi}
          setDeskripsi={setDeskripsi}
          pemetaan={pemetaan}
          setPemetaan={setPemetaan}
          handleSimpanTambah={handleSimpanTambah}
          handleSimpanEdit={handleSimpanEdit}
          handleBatal={() => setModalOpen(false)}
          selectOptions={selectOptions}
        />
        <DeleteProfilDialog
          open={confirmDeleteOpen}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}
