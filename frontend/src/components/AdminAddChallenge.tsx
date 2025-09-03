import { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import Papa from 'papaparse';
import type { ParseResult } from 'papaparse';
import Modal from './Modal';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; // Add this line

// this is like the model we would have in mongodb.
// it is used to define the shape of the data we are working with
type Challenge = {
  id: number;
  title: string;
  description: string;
};

export default function AdminAddChallenge() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchChallenges = async () => {
    const res = await axios.get(`${BACKEND_URL}/challenges`); // Use BACKEND_URL
    setChallenges(Array.isArray(res.data) ? res.data : []);
  };

  // Fetch challenges
  useEffect(() => {
    fetchChallenges();
  }, []);

  // Add challenge
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      await axios.post(`${BACKEND_URL}/challenges`, { title, description }); // Use BACKEND_URL
      setMessage('Challenge added!');
      setTitle('');
      setDescription('');
      fetchChallenges();
    } catch (err) {
      setMessage('Failed to add challenge.');
    }
  };


  // Start editing
  const startEdit = (challenge: Challenge) => {
    setEditingId(challenge.id);
    setEditTitle(challenge.title);
    setEditDescription(challenge.description);
  };

  // Save edit
  const handleEditSave = async (id: number) => {
    await axios.put(`${BACKEND_URL}/challenges/${id}`, { title: editTitle, description: editDescription }); // Use BACKEND_URL
    setEditingId(null);
    fetchChallenges();
  };

  // Cancel edit
  const handleEditCancel = () => {
    setEditingId(null);
  };

  
  const handleCSVUploadClick = () => {
    if (!csvFile) return;
    Papa.parse(csvFile, {
      header: true,
      complete: async (results: ParseResult<any>) => {
        try {
          const validChallenges = results.data.filter(
            (row: any) => row.title && row.description
          );
          if (validChallenges.length === 0) {
            setMessage('No valid challenges found in CSV.');
            return;
          }
          await axios.post(`${BACKEND_URL}/challenges/bulk`, { challenges: validChallenges }); // Use BACKEND_URL
          setMessage('CSV uploaded and challenges added!');
          fetchChallenges();
        } catch (err: any) {
          setMessage('Error uploading CSV: ' + (err.response?.data?.error || err.message));
        }
      },
      error: (error) => {
        setMessage('Error parsing CSV: ' + error.message);
      }
    });
  };

  const handleConfirmDelete = async () => {
    if (deleteId !== null) {
      await axios.delete(`${BACKEND_URL}/challenges/${deleteId}`); // Use BACKEND_URL
      fetchChallenges();
      setMessage('Challenge deleted.');
    }
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800 px-2 sm:px-4">
      <div className="w-full max-w-3xl mx-auto pt-16 pb-16 space-y-8">
        {/* Add Challenge Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 space-y-4"
        >
          <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">Add New Challenge</h2>
          {message && (
            <div className="mb-2 text-sm text-blue-700 dark:text-blue-300">{message}</div>
          )}
          <input
            className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <textarea
            className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded hover:bg-blue-700 dark:hover:bg-blue-800"
          >
            Add Challenge
          </button>
        </form>

        {/* CSV Upload */}
        <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="mb-4">
            <label className="block text-lg font-bold mb-1 text-gray-800 dark:text-gray-100">Bulk Upload Challenges</label>
            <p className="mb-2 text-gray-700 dark:text-gray-300 text-sm">
              Upload a CSV file to add multiple challenges at once. The CSV file should have columns for <b>title</b> and <b>description</b>.
            </p>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept=".csv"
                onChange={e => setCsvFile(e.target.files?.[0] || null)}
                className="flex-1 border border-gray-300 dark:border-gray-600 p-2 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              />
              <span className="text-gray-400 dark:text-gray-300 text-sm">
                {csvFile ? csvFile.name : "No file uploaded"}
              </span>
            </div>
          </div>
          <button
            onClick={handleCSVUploadClick}
            className="w-full px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded hover:bg-green-700 dark:hover:bg-green-800"
            disabled={!csvFile}
          >
            Upload CSV
          </button>
        </div>

        {/* Challenges Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200">Title</th>
                <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200">Description</th>
                <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody>
              {challenges.map((ch) => (
                <tr key={ch.id} className="border-t border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-100">
                    {editingId === ch.id ? (
                      <input
                        className="w-full border border-gray-300 dark:border-gray-600 p-1 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                      />
                    ) : (
                      ch.title
                    )}
                  </td>
                  <td className="px-4 py-2 text-gray-900 dark:text-gray-100">
                    {editingId === ch.id ? (
                      <textarea
                        className="w-full border border-gray-300 dark:border-gray-600 p-1 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        value={editDescription}
                        onChange={e => setEditDescription(e.target.value)}
                      />
                    ) : (
                      ch.description
                    )}
                  </td>
                  <td className="px-4 py-2 space-x-2 flex">
                    {editingId === ch.id ? (
                      <>
                        <button
                          className="px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                          onClick={() => handleEditSave(ch.id)}
                          type="button"
                          title="Save"
                        >
                          Save
                        </button>
                        <button
                          className="px-2 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                          onClick={handleEditCancel}
                          type="button"
                          title="Cancel"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="p-2 rounded hover:bg-yellow-100 dark:hover:bg-yellow-900"
                          onClick={() => startEdit(ch)}
                          type="button"
                          title="Edit"
                        >
                          <FiEdit2 className="text-yellow-600 dark:text-yellow-300" size={18} />
                        </button>
                        <button
                          className="p-2 rounded hover:bg-red-100 dark:hover:bg-red-900"
                          onClick={() => {
                            setDeleteId(ch.id);
                            setShowDeleteModal(true);
                          }}
                          type="button"
                          title="Delete"
                        >
                          <FiTrash2 className="text-red-600 dark:text-red-300" size={18} />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {challenges.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                    No challenges found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Modal
          isOpen={showDeleteModal}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Delete Challenge"
          message="Are you sure you want to delete this challenge? This action cannot be undone."
        />
      </div>
    </div>
  );
}