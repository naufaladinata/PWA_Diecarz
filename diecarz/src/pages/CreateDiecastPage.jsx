import DiecastForm from '../components/diecast/DiecastForm';
import diecastService from '../services/diecastService';
import uploadService from '../services/uploadService';

export default function CreateDiecastPage({ onDone, onCancel }) {
  const save = async (payload, file) => {
    if (file) payload.image_url = await uploadService.upload(file);
    await diecastService.create(payload);
    onDone();
  };
  return <DiecastForm title="Tambah diecast" useDraft onSubmit={save} onCancel={onCancel} />;
}
