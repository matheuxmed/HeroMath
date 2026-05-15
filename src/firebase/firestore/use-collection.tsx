'use client';

import { useEffect, useState } from 'react';
import { 
  Query, 
  onSnapshot, 
  QuerySnapshot, 
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';

export function useCollection<T = DocumentData>(query: Query<T> | null) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [snapshot, setSnapshot] = useState<QuerySnapshot<T> | null>(null);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      query,
      (querySnapshot) => {
        const items: T[] = [];
        querySnapshot.forEach((doc) => {
          items.push({ ...doc.data(), id: doc.id } as T);
        });
        setData(items);
        setSnapshot(querySnapshot);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [query]);

  return { data, loading, error, snapshot };
}
