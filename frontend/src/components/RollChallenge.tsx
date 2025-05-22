import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';

import api from '../api/axios';


type Challenge = {
  id: number;
  title: string;
  description: string;
};

export default function RollChallenge() {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const queryClient = useQueryClient(); 

  const fetchRandom = async () => {
    setMessage(null);
    const res = await api.get<Challenge>('/challenges/random');
    setChallenge(res.data);
  };

  const saveMutation = useMutation({
  mutationFn: async () => {
    if (!challenge) return;
    await api.post('/my-challenges', { challengeId: challenge.id });
  },
  onSuccess: () => {
    setMessage('Challenge saved!');
    queryClient.invalidateQueries({ queryKey: ['my-challenges'] });
    setMessageType('success');
  },
  onError: () => {
    setMessage('Failed to save challenge.');
    setMessageType('error');
  },
});

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] mx-auto p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-blue-900 rounded-xl shadow-lg">
      <h1 className="flex items-center gap-2 text-4xl font-extrabold mb-8 text-blue-700 dark:text-blue-300 drop-shadow">
        <GiPerspectiveDiceSixFacesRandom size={36} className="inline-block mb-1" />
        DevDice
      </h1>

      {message && (
        <div
          className={`mb-4 px-4 py-2 rounded font-medium shadow ${
            messageType === 'success'
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400'
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-400'
          }`}
        >
          {message}
        </div>
      )}

      <button
        className="mb-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800 dark:text-white font-semibold rounded-lg shadow transition disabled:opacity-60"
        onClick={fetchRandom}
        disabled={saveMutation.isPending}
      >
        {challenge ? 'Roll Again' : 'Roll Challenge'}
      </button>

      {challenge && (
        <div className="w-full max-w-lg border border-blue-200 p-6 rounded-2xl shadow bg-white dark:bg-gray-800 flex flex-col items-start">
          <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-2">{challenge.title}</h2>
          <p className="mb-4 text-gray-700 dark:text-gray-300">{challenge.description}</p>
          <button
            className="self-end px-5 py-2 bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-800 dark:text-white font-semibold rounded-lg transition disabled:opacity-60"
            onClick={() => saveMutation.mutate()}
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending ? 'Saving...' : 'Save Challenge'}
          </button>
        </div>
      )}
    </div>
  );
}