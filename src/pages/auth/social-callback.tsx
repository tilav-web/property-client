import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleStorage } from '@/utils/handle-storage';
import { useUserStore } from '@/stores/user.store';
import { userService } from '@/services/user.service';

export default function SocialCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useUserStore();

  useEffect(() => {
    const accessToken = searchParams.get('access_token');
    if (accessToken) {
      handleStorage({ key: 'access_token', value: accessToken });
      // Optionally, fetch user data with the new token
      userService.findMe().then(data => {
        setUser(data);
        navigate('/'); // Redirect to main page after setting user
      }).catch(error => {
        console.error('Error fetching user data after social login:', error);
        navigate('/auth/login'); // Redirect to login on error
      });
    } else {
      // If no access token is found, redirect to login page
      navigate('/auth/login');
    }
  }, [navigate, searchParams, setUser]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <p>Loading...</p>
    </div>
  );
}
