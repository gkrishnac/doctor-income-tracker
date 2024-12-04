import { collection, addDoc } from 'firebase/firestore';
import { db as firestoreDb } from '../firebase/firebase.config';
import { db as offlineDb, getUnsyncedConsultations, markConsultationAsSynced } from '../offline/offlineService';

export const syncOfflineData = async () => {
  const unsyncedConsultations = await getUnsyncedConsultations();

  for (const consultation of unsyncedConsultations) {
    try {
      await addDoc(collection(firestoreDb, 'consultations'), {
        patientId: consultation.patientId,
        establishmentId: consultation.establishmentId,
        appointmentDate: consultation.appointmentDate,
        billAmount: consultation.billAmount,
        notes: consultation.notes,
        deductibles: consultation.deductibles,
      });
      await markConsultationAsSynced(consultation.id!);
    } catch () {
      console(' syncing consultation:',);
    }
  }
};
