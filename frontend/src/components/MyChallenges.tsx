import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { FiBook, FiCheckCircle, FiTrash2 } from 'react-icons/fi';
import Modal from './Modal'; 
import { useState } from 'react';

type UserChallenge = {
  id: number;
  status: string;
  createdAt: string;
  challenge: {
    title: string;
    description: string;
  };
};
export default function MyChallenges() {
  const queryClient = useQueryClient();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading, error } = useQuery<UserChallenge[]>({
    queryKey: ['my-challenges'],
    queryFn: async () => {
      const res = await api.get('/my-challenges');
      return res.data;
    },
  });

  const completeMutation = useMutation<void, Error, number>({
    mutationFn: (id) => api.patch(`/my-challenges/${id}`, { status: 'completed' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-challenges'] }),
  });

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: (id) => api.delete(`/my-challenges/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-challenges'] }),
  });
  const handleConfirmDelete = async () => {
  if (deleteId !== null) {
    deleteMutation.mutate(deleteId);
  }
  setShowDeleteModal(false);
  setDeleteId(null);
};

const handleCancelDelete = () => {
  setShowDeleteModal(false);
  setDeleteId(null);
};

  if (isLoading) return <div className="flex justify-center items-center h-40"><span className="text-gray-500">Loading...</span></div>;
  if (error) return <div className="flex justify-center items-center h-40"><span className="text-red-500">Error loading challenges.</span></div>;
  
  const totalCompleted = data?.filter(ch => ch.status === 'completed').length ?? 0;


  return (
    <section className=" p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-blue-700 dark:text-blue-300 flex items-center justify-center gap-2">
        <FiBook className="inline-block mb-1" size={28} />
        My Challenges
      </h1>
      {(!data || data.length === 0) && (
        <div className="text-center text-gray-700 dark:text-gray-300">No challenges yet.</div>
      )}
      <div>
        <p className="text-lg text-black dark:text-white font-semibold flex items-center gap-2">
          <FiCheckCircle className="text-green-600 dark:text-green-400" size={22} />
          Total Completed: {totalCompleted} / {data?.length ?? 0}
        </p>
      </div>

      <div className="grid gap-6">
        {data?.map((uc: UserChallenge) => (
          <div
            key={uc.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 flex flex-col gap-2"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{uc.challenge.title}</h2>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  uc.status === 'completed'
                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200'
                }`}
              >
                {uc.status.charAt(0).toUpperCase() + uc.status.slice(1)}
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300">{uc.challenge.description}</p>
            <div className="flex gap-2 justify-between">
              {uc.status === 'pending' && (
                <button
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800 dark:text-white rounded-lg transition"
                  onClick={() => completeMutation.mutate(uc.id)}
                  disabled={completeMutation.isPending}
                >
                  {completeMutation.isPending ? 'Marking...' : 'Mark Completed'}
                </button>
              )}
              <div className="flex-1" />
              <button
                onClick={() => {
                  setDeleteId(uc.id);
                  setShowDeleteModal(true);
                }}
                className="p-2 rounded hover:bg-red-100 dark:hover:bg-red-900 ml-auto"
                title="Remove"
              >
                <FiTrash2 className="text-red-600 dark:text-red-300" size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
      {showDeleteModal && deleteId !== null && (
        <Modal
          isOpen={showDeleteModal}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Delete Challenge"
          message="Are you sure you want to delete this challenge? This action cannot be undone."
        />
      )}
    </section>
  );
}