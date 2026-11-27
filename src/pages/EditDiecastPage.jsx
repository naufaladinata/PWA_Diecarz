import { useDiecastById } from '../hooks/useDiecasts';
import DiecastForm from '../components/diecast/DiecastForm';
import diecastService from '../services/diecastService';
import uploadService from '../services/uploadService';

export default function EditDiecastPage({ id, onDone, onCancel }) {
  const { data, loading, error, refetch } = useDiecastById(id);
  if (loading) return <p className="state">Memuat data...</p>;
  if (error) return <div className="state"><p>{error.message}</p><button className="btn" onClick={refetch}>Coba lagi</button></div>;
  const save = async (payload, file) => {
    if (file) payload.image_url = await uploadService.upload(file);
    else payload.image_url = data.image_url;
    await diecastService.update(id, payload);
    onDone();
  };
  return <DiecastForm title="Edit diecast" initial={data} onSubmit={save} onCancel={onCancel} />;
}
