import { useState } from 'react';
import { useAsync } from './useAsync';
import reviewService from '../services/reviewService';

export function useReviews(id) {
  return useAsync(() => (String(id).startsWith('local-') ? Promise.resolve([]) : reviewService.list(id)), [id]);
}

export function useCreateReview() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const submit = async (id, payload) => {
    setLoading(true); setError(null);
    try { return await reviewService.create(id, payload); }
    catch (e) { setError(e); throw e; }
    finally { setLoading(false); }
  };
  return { submit, loading, error };
}
