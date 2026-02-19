import { useState, useEffect } from 'react';
import axios from '../../services/axios';
import { toast } from 'react-toastify';

export default function Profile() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Assume user data is in localStorage or context
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) setUser(storedUser);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put('/auth/profile', user);
      localStorage.setItem('user', JSON.stringify(res.data));
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    }
    setLoading(false);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">My Profile</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={user.name || ''}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                  />
                </div>
                <h4>Address</h4>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Street</label>
                    <input
                      type="text"
                      className="form-control"
                      value={user.address?.street || ''}
                      onChange={(e) => setUser({ ...user, address: { ...user.address, street: e.target.value } })}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-control"
                      value={user.address?.city || ''}
                      onChange={(e) => setUser({ ...user, address: { ...user.address, city: e.target.value } })}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">State</label>
                    <input
                      type="text"
                      className="form-control"
                      value={user.address?.state || ''}
                      onChange={(e) => setUser({ ...user, address: { ...user.address, state: e.target.value } })}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Postal Code</label>
                    <input
                      type="text"
                      className="form-control"
                      value={user.address?.postalCode || ''}
                      onChange={(e) => setUser({ ...user, address: { ...user.address, postalCode: e.target.value } })}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Country</label>
                    <input
                      type="text"
                      className="form-control"
                      value={user.address?.country || ''}
                      onChange={(e) => setUser({ ...user, address: { ...user.address, country: e.target.value } })}
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Profile'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}