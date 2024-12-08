import { useAuth } from '@/contexts/AuthContext';
import { sendGAEvent } from '@next/third-parties/google';
import { useRouter } from 'next/router';

const AuthButton = ({ variant = 'ghost', children, onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`
      px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
      transform hover:scale-[1.02] active:scale-[0.98]
      ${variant === 'primary' 
        ? 'bg-secondary text-white hover:bg-blue-600 hover:shadow-md' 
        : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
      }
      ${className}
    `}
  >
    {children}
  </button>
);

const AuthButtons = ({ isMobile }) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const containerClass = isMobile ? "flex flex-col gap-2 w-full" : "flex items-center gap-3";

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (user) {
    return (
      <div className={containerClass}>
        <AuthButton 
          variant="ghost" 
          onClick={() => router.push('/dashboard')}
          className={isMobile ? "w-full" : ""}
        >
          Dashboard
        </AuthButton>
        <AuthButton 
          variant="primary" 
          onClick={handleLogout}
          className={isMobile ? "w-full" : ""}
        >
          Logout
        </AuthButton>
      </div>
    );
  }

  return (
    <div className={containerClass}>
      <AuthButton 
        variant="ghost" 
        onClick={() => router.push('/login')}
        className={isMobile ? "w-full" : ""}
      >
        Login
      </AuthButton>
      <AuthButton 
        variant="primary" 
        onClick={() => {
          sendGAEvent('event', 'signup_start', {
            source: 'header'
          });
          return router.push('/signup')
        }}
        className={isMobile ? "w-full" : ""}
      >
        Sign Up
      </AuthButton>
    </div>
  );
};

export default AuthButtons;