import { useState } from 'react';
import Head from 'next/head';
import { useAuth } from '@/contexts/AuthContext';
import Loading from '@/components/Loading';

export default function AccountSettings() {
  const { user, setUser, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  if (authLoading) {
    return <Loading message="Loading account settings..." />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    
    try {
      const formData = new FormData(e.target);
      const response = await fetch('/api/settings/account', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: formData.get('full_name'),
          email: formData.get('email'),
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update settings');
      }
      
      const updatedUserResponse = await fetch('/api/auth/me');
      if (updatedUserResponse.ok) {
        const userData = await updatedUserResponse.json();
        setUser(userData);
      }
      
      setMessage({ type: 'success', text: 'Settings updated successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Account Settings | MiniFyn Dashboard</title>
      </Head>
      
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Account Settings</h1>
        
        {message && (
          <div className={`mb-4 p-4 rounded-lg ${
            message.type === 'error' 
              ? 'bg-coral/10 text-coral' 
              : 'bg-teal/10 text-teal'
          }`}>
            {message.text}
          </div>
        )}

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                user?.is_verified 
                  ? 'bg-teal/10 text-teal' 
                  : 'bg-coral/10 text-coral'
              }`}>
                {user?.is_verified ? 'Verified Account' : 'Unverified Account'}
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-dark-gray mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="full_name"
                  defaultValue={user?.full_name || ''}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-secondary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dark-gray mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  defaultValue={user?.email || ''}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-secondary"
                />
                {!user?.is_verified && (
                  <p className="mt-2 text-sm text-coral">
                    Please verify your email address to access all features.
                  </p>
                )}
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary/90 disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}