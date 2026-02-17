import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRole }) {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) return <Navigate to="/" />;

  console.log("Allowed Role :", allowedRole);
  console.log("User Role :", user?.role);
  
  

  if (allowedRole && user.role !== allowedRole)
    return <Navigate to="/" />;

  return children;
}