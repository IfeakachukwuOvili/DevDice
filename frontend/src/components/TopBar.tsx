import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoMoon, IoSunny } from 'react-icons/io5';
import Modal from './Modal';
import { useTheme } from '../hooks/useTheme';
import { useUser } from '../hooks/useUser';
import { useDropdown } from '../hooks/useDropdown';

export default function TopBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();
  const { isDropdownOpen, setIsDropdownOpen, dropdownRef } = useDropdown();
  const {
    user,
    statusMessage,
    messageType,
    handleSignOut,
    handleDeleteAccount,
    updateProfile,
    setStatusMessage,
  } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [showAdminKeyModal, setShowAdminKeyModal] = useState(false);
  const [adminKeyInput, setAdminKeyInput] = useState('');
  const [adminKeyError, setAdminKeyError] = useState('');

  const handleDeleteClick = () => {
    setIsModalOpen(true);
    setIsDropdownOpen(false);
  };

  const handleProfileUpdate = async () => {
    const success = await updateProfile(newName, currentPassword, newPassword);
    if (success) {
      setTimeout(() => {
        setIsEditingProfile(false);
        setNewPassword('');
        setCurrentPassword('');
      }, 2000);
    }
  };

  const handleDeleteConfirm = async () => {
    const success = await handleDeleteAccount();
    if (!success) {
      setIsModalOpen(false);
    }
  };

  // Determine if we're on the admin page
  const isOnAdminPage = location.pathname.startsWith('/admin');

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo / App Name */}
          <h1
            onClick={() => navigate('/')}
            className="text-xl font-bold cursor-pointer text-gray-900 dark:text-white"
          >
            DevDice
          </h1>

          {/* Right side: profile */}
          <div className="flex items-center gap-4 ml-auto">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <IoSunny className="text-xl text-yellow-500" />
              ) : (
                <IoMoon className="text-xl text-gray-600" />
              )}
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="cursor-pointer bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-900 dark:text-white"
              >
                {user ? user.name : 'Loading...'}
              </button>

              {/* Dropdown menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded shadow-lg min-w-[240px] z-50">
                  {isEditingProfile ? (
                    <div className="p-4">
                      <input
                        type="text"
                        placeholder="New Name"
                        defaultValue={user?.name}
                        onChange={(e) => setNewName(e.target.value)}
                        className="w-full mb-2 px-3 py-2 border rounded"
                      />
                      <input
                        type="password"
                        placeholder="Current Password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full mb-2 px-3 py-2 border rounded"
                      />
                      <input
                        type="password"
                        placeholder="New Password (optional)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full mb-2 px-3 py-2 border rounded"
                      />

                      {/* Status Message */}
                      {statusMessage && (
                        <div
                          className={`mb-4 px-3 py-2 rounded text-sm ${
                            messageType === 'success'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {statusMessage}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={handleProfileUpdate}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setIsEditingProfile(false);
                            setNewPassword('');
                            setCurrentPassword('');
                            setStatusMessage('');
                          }}
                          className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsEditingProfile(true)}
                        className="block px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        Edit Profile
                      </button>
                      {/* Dynamic Admin/User Page link */}
                      {!isOnAdminPage ? (
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            if (user?.isAdmin) {
                              navigate('/admin');
                            } else {
                              setShowAdminKeyModal(true);
                            }
                          }}
                          className="block px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          Admin Page
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            navigate('/home'); // or navigate('/') if that's your main user page
                          }}
                          className="block px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                          User Page
                        </button>
                      )}
                      <button
                        onClick={handleSignOut}
                        className="block px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        Sign Out
                      </button>
                      <button
                        onClick={handleDeleteClick}
                        className="block px-4 py-2 w-full text-left text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        Delete Account
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Account"
        message="Are you sure you want to delete your account? This action cannot be undone."
      />
      <Modal
        isOpen={showAdminKeyModal}
        onClose={() => {
          setShowAdminKeyModal(false);
          setAdminKeyInput('');
          setAdminKeyError('');
        }}
        onConfirm={() => {
          if (adminKeyInput === 'Cencadian_2025') {
            // Set isAdmin to true in localStorage user object
            const userObj = JSON.parse(localStorage.getItem('user') || '{}');
            userObj.isAdmin = true;
            localStorage.setItem('user', JSON.stringify(userObj));
            setShowAdminKeyModal(false);
            setAdminKeyInput('');
            setAdminKeyError('');
            navigate('/admin');
            window.location.reload(); // Reload the page to reflect the changes
          } else {
            setAdminKeyError('Invalid secret key.');
          }
        }}
        title="Admin Access"
        message={
          <div>
            <p>Enter the admin secret key to access the admin page:</p>
            <input
              type="password"
              value={adminKeyInput}
              onChange={e => {
                setAdminKeyInput(e.target.value);
                setAdminKeyError('');
              }}
              className="mt-2 w-full px-3 py-2 border rounded bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              placeholder="Secret Key"
            />
            {adminKeyError && (
              <p className="mt-1 text-xs text-red-500">{adminKeyError}</p>
            )}
          </div>
        }
        confirmText="Submit"
        showCancel={true}
      />
    </>
  );
}