import { Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

export default function SignupFields({ 
  formData, 
  setFormData, 
  showPassword, 
  setShowPassword,
  isLoading 
}) {
  const { t } = useTranslation('auth');

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="fullName">
            {t('fullName')}
          </label>
          <input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={e => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-secondary"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">
            {t('email')}
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-secondary"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="password">
            {t('password')}
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={e => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-secondary pr-10"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-2 top-2.5 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="confirmPassword">
            {t('confirmPassword')}
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={e => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-secondary"
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="flex items-start gap-2">
        <input
          id="terms"
          type="checkbox"
          checked={formData.agreeTerms}
          onChange={e => setFormData(prev => ({ ...prev, agreeTerms: e.target.checked }))}
          className="mt-1"
          required
          disabled={isLoading}
        />
        <label className="text-sm" htmlFor="terms">
          {t('termsAgree')} <Link href="/legal/terms" className="text-secondary hover:underline">{t('termsAndConditions')}</Link>
        </label>
      </div>
    </>
  );
}