import Link from 'next/link';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Trash2 } from 'lucide-react';

export default function RecentLinksList({ links, onDelete, onCreateNew }) {
  const [expandedLink, setExpandedLink] = useState(null);

  const handleDelete = async (shortCode) => {
    if (window.confirm('Are you sure you want to delete this link?')) {
      await onDelete(shortCode);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Links</h2>
      <ul className="bg-white shadow overflow-hidden sm:rounded-md divide-y divide-gray-200">
        {links?.map((link) => (
          <li key={link.shortCode} className="hover:bg-gray-50">
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <Link href={link.shortUrl} target="_blank" className="text-sm font-medium text-secondary truncate">
                  {link.shortUrl}
                </Link>
                <div className="ml-2 flex-shrink-0 flex">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {link.clicks} clicks
                  </span>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <p className="flex items-center text-sm text-gray-500">
                    {link.originalUrl}
                  </p>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                  <button 
                    onClick={() => setExpandedLink(expandedLink === link.shortCode ? null : link.shortCode)}
                    className="text-secondary hover:underline mr-2"
                  >
                    {expandedLink === link.shortCode ? 'Less' : 'More'}
                  </button>
                  {/* <button 
                    onClick={() => handleDelete(link.shortCode)}
                    className="text-red-500 hover:underline"
                  >
                    <TrashIcon size={16} />
                  </button> */}
                  <button
                    onClick={() => handleDelete(link.shortCode)}
                    className={`p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100 
                      disabled:opacity-50 disabled:cursor-not-allowed`}
                    title="Delete link"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              {expandedLink === link.shortCode && (
                <div className="mt-2 text-sm text-gray-500">
                  <p>Created: {formatDistanceToNow(new Date(link.createdAt))} ago</p>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
      <button 
        onClick={onCreateNew}
        className="mt-4 bg-secondary text-white px-4 py-2 rounded-md hover:bg-secondary-dark"
      >
        Create New Link
      </button>
    </div>
  );
}