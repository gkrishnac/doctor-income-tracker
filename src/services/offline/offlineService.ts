import Dexie from 'dexie';

interface OfflineConsultation {
  id?: number;
  patientId: string;
  establishmentId: string;
  appointmentDate: Date;
  billAmount: number;
  notes: string;
  deductibles: {
    id: string;
    amount: number;
  }[];
  synced: boolean;
}

class OfflineDatabase extends Dexie {
  consultations: Dexie.Table<OfflineConsultation, number>;

  constructor() {
    super('OfflineDatabase');
    this.version(1).stores({
      consultations: '++id, patientId, establishmentId, appointmentDate, billAmount, notes, deductibles, synced',
    });
    this.consultations = this.table('consultations');
  }
}

export const db = new OfflineDatabase();

export const saveConsultationOffline = async (consultation: OfflineConsultation) => {
  await db.consultations.add({ ...consultation, synced: false });
};

export const getUnsyncedConsultations = async () => {
  return await db.consultations.where('synced').equals(false).toArray();
};

export const markConsultationAsSynced = async (id: number) => {
  await db.consultations.update(id, { synced: true });
};
