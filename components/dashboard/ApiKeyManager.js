import { useState, useEffect } from 'react';
import { Copy, Trash, Plus, ExternalLink } from 'lucide-react';

export default function ApiKeyManager() {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewKey, setShowNewKey] = useState(null);
  const [newKeyName, setNewKeyName] = useState('');

  useEffect(() => {
    fetchKeys();
  }, []);

  async function fetchKeys() {
    try {
      const res = await fetch('/api/dashboard/api-keys');
      if (res.ok) {
        const data = await res.json();
        setKeys(data);
      }
    } finally {
      setLoading(false);
    }
  }

  async function createKey(e) {
    e.preventDefault();
    try {
      const res = await fetch('/api/dashboard/api-keys', {
        method: 'POST',
        body: JSON.stringify({ name: newKeyName })
      });
      if (res.ok) {
        const newKey = await res.json();
        setShowNewKey(newKey.key);
        setKeys([newKey, ...keys]);
        setNewKeyName('');
      }
    } catch (error) {
      console.error('Failed to create key:', error);
    }
  }

  async function deleteKey(keyId) {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) return;

    try {
      const res = await fetch('/api/dashboard/api-keys', {
        method: 'DELETE',
        body: JSON.stringify({ keyId })
      });
      if (res.ok) {
        setKeys(keys.filter(k => k.id !== keyId));
      }
    } catch (error) {
      console.error('Failed to delete key:', error);
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Your API Keys</h2>
            <button 
              onClick={() => setShowNewKey('form')}
              className="flex items-center gap-2 bg-teal hover:bg-opacity-90 text-white px-4 py-2 rounded"
            >
              <Plus className="w-4 h-4" />
              New Key
            </button>
          </div>
        </div>
        <div className="p-6">
          {showNewKey === 'form' && (
            <form onSubmit={createKey} className="mb-6 p-4 border rounded bg-light-gray">
              <label className="block mb-2">Key Name</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g. Production API Key"
                  className="flex-1 p-2 border rounded"
                  required
                />
                <button 
                  type="submit"
                  className="bg-teal text-white px-4 py-2 rounded hover:bg-opacity-90"
                >
                  Create
                </button>
              </div>
            </form>
          )}

          {typeof showNewKey === 'string' && showNewKey !== 'form' && (
            <div className="mb-6 p-4 border rounded bg-light-gray">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <p className="text-sm font-medium mb-1">New API Key Created</p>
                  <p className="text-xs text-dark-gray mb-2">Copy this key now. You won&apos;t be able to see it again!</p>
                  <code className="block p-2 bg-white rounded text-sm break-all">{showNewKey}</code>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(showNewKey);
                    setShowNewKey(null);
                  }}
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90"
                >
                  Copy & Close
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {keys.map(key => (
              <div key={key.id} className="flex items-center justify-between p-4 bg-light-gray rounded">
                <div>
                  <p className="font-medium">{key.name}</p>
                  <p className="text-sm text-dark-gray">Created {new Date(key.created_at).toLocaleDateString()}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-sm bg-white px-2 py-1 rounded">
                      {key.key.slice(0, 8)}...{key.key.slice(-4)}
                    </code>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right text-sm">
                    <p className="text-dark-gray">Monthly Usage</p>
                    <p>{key.monthly_usage || 0} / {key.limit_value}</p>
                  </div>
                  <button 
                    onClick={() => deleteKey(key.id)}
                    className="text-coral hover:text-opacity-80"
                    title="Delete API Key"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {keys.length === 0 && !showNewKey && (
              <p className="text-center text-dark-gray py-4">
                No API keys yet. Create one to get started.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Documentation</h2>
        </div>
        <div className="p-6">
          <p className="mb-4">
            Learn how to integrate MiniFyn URL shortener in your applications.
          </p>
          <a
            href="/api-docs"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-secondary hover:text-primary"
          >
            View API Documentation
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}