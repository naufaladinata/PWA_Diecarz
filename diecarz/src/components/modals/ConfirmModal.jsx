export default function ConfirmModal({ title, message, confirmText = 'Hapus', loading, onConfirm, onCancel }) {
  return (
    <div className="modal-back" onClick={onCancel}>
      <div className="modal" role="alertdialog" aria-modal="true" aria-labelledby="cm-title" onClick={(e) => e.stopPropagation()}>
        <h3 id="cm-title">{title}</h3>
        <p>{message}</p>
        <div className="row-end">
          <button className="btn btn-ghost" onClick={onCancel} disabled={loading}>Batal</button>
          <button className="btn" onClick={onConfirm} disabled={loading}>{loading ? 'Memproses...' : confirmText}</button>
        </div>
      </div>
    </div>
  );
}
