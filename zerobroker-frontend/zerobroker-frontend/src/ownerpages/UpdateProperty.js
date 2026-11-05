
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../ownerpagestyle/UpdateProperty.css';

function UpdateProperty() {
  const { propertyId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: '',
    bhk: '',
    rent: '',
    deposit: '',
    city: '',
    location: '',
    address: '',
    furnishing: '',
    availableFrom: '',
    tenantPreference: '',
    status: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Load property details
  useEffect(() => {
    const token = localStorage.getItem('token');
    const ownerId = localStorage.getItem('userId');

    if (!token || !ownerId) {
      navigate('/login');
      return;
    }

    if (!propertyId) {
      setError('Property ID is missing.');
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchProperty = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/properties/${encodeURIComponent(propertyId)}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
            signal: controller.signal,
          }
        );

        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          localStorage.removeItem('roleName');
          navigate('/login');
          throw new Error(
            'Your session expired or you do not have permission to access this property.'
          );
        }

        if (!response.ok) {
          throw new Error(
            response.status === 404
              ? 'Property not found.'
              : `Failed to load property. Status: ${response.status}`
          );
        }

        const data = await response.json();

        setFormData({
          title: data.title ?? '',
          description: data.description ?? '',
          propertyType: data.propertyType ?? '',
          bhk: data.bhk ?? '',
          rent: data.rent ?? '',
          deposit: data.deposit ?? '',
          city: data.city ?? '',
          location: data.location ?? '',
          address: data.address ?? '',
          furnishing: data.furnishing ?? '',
          availableFrom: data.availableFrom
            ? String(data.availableFrom).slice(0, 10)
            : '',
          tenantPreference: data.tenantPreference ?? '',
          status: data.status ?? '',
        });

        setError('');
      } catch (err) {
        if (err.name === 'AbortError') return;

        console.error('Fetch property error:', err);
        setError(err.message || 'Failed to load property.');
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProperty();

    return () => controller.abort();
  }, [propertyId, navigate]);

  // Handle form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // Update property
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const token = localStorage.getItem('token');
    const ownerId = localStorage.getItem('userId');

    if (!token || !ownerId) {
      navigate('/login');
      return;
    }

    if (!propertyId) {
      setError('Property ID is missing.');
      return;
    }

    if (
      formData.bhk !== '' &&
      (!Number.isFinite(Number(formData.bhk)) ||
        Number(formData.bhk) < 1)
    ) {
      setError('BHK must be at least 1.');
      return;
    }

    if (
      formData.rent === '' ||
      !Number.isFinite(Number(formData.rent)) ||
      Number(formData.rent) < 0
    ) {
      setError('Please enter a valid rent.');
      return;
    }

    if (
      formData.deposit === '' ||
      !Number.isFinite(Number(formData.deposit)) ||
      Number(formData.deposit) < 0
    ) {
      setError('Please enter a valid deposit.');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        `http://localhost:8080/api/properties/${encodeURIComponent(propertyId)}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            owner: {
              userId: Number(ownerId),
            },
            title: formData.title.trim(),
            description: formData.description.trim(),
            propertyType: formData.propertyType,
            bhk: formData.bhk === '' ? null : Number(formData.bhk),
            rent: Number(formData.rent),
            deposit: Number(formData.deposit),
            city: formData.city.trim(),
            location: formData.location.trim(),
            address: formData.address.trim(),
            furnishing: formData.furnishing,
            availableFrom: formData.availableFrom,
            tenantPreference: formData.tenantPreference,
            status: formData.status,
          }),
        }
      );

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('roleName');
        navigate('/login');
        throw new Error(
          'Your session expired or you do not have permission to update this property.'
        );
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Update property response:', errorText);

        throw new Error(
          errorText || `Failed to update property. Status: ${response.status}`
        );
      }

      alert('Property updated successfully!');
      navigate('/owner/my-properties');
    } catch (err) {
      console.error('Update property error:', err);
      setError(err.message || 'Failed to update property. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="update-property-page">
        <div className="update-property-card">
          <h2>Loading Property...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="update-property-page">
      <div className="update-property-card">
        <h1>Update Property</h1>

        <p className="update-subtitle">
          Update your property details
        </p>

        {error && (
          <div className="update-error" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Property Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter property title"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter property description"
              rows="4"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Property Type</label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                required
              >
                <option value="">Select Property Type</option>
                <option value="1 RK">1 RK</option>
                <option value="1 BHK">1 BHK</option>
                <option value="2 BHK">2 BHK</option>
                <option value="3 BHK">3 BHK</option>
                <option value="4 BHK">4 BHK</option>
              </select>
            </div>

            <div className="form-group">
              <label>BHK</label>
              <input
                type="number"
                name="bhk"
                value={formData.bhk}
                onChange={handleChange}
                placeholder="Enter BHK"
                min="1"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Monthly Rent</label>
              <input
                type="number"
                name="rent"
                value={formData.rent}
                onChange={handleChange}
                placeholder="Enter rent"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Deposit</label>
              <input
                type="number"
                name="deposit"
                value={formData.deposit}
                onChange={handleChange}
                placeholder="Enter deposit"
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
                required
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter location"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter complete address"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Furnishing</label>
              <select
                name="furnishing"
                value={formData.furnishing}
                onChange={handleChange}
                required
              >
                <option value="">Select Furnishing</option>
                <option value="UNFURNISHED">UNFURNISHED</option>
                <option value="SEMI-FURNISHED">SEMI-FURNISHED</option>
                <option value="FULLY-FURNISHED">FULLY-FURNISHED</option>
              </select>
            </div>

            <div className="form-group">
              <label>Available From</label>
              <input
                type="date"
                name="availableFrom"
                value={formData.availableFrom}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Tenant Preference</label>
              <select
                name="tenantPreference"
                value={formData.tenantPreference}
                onChange={handleChange}
                required
              >
                <option value="">Select Preference</option>
                <option value="FAMILY">FAMILY</option>
                <option value="BACHELOR">BACHELOR</option>
                <option value="GIRLS">GIRLS</option>
                <option value="BOYS">BOYS</option>
              </select>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="RENTED">RENTED</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>
          </div>

          <div className="update-buttons">
            <button
              type="submit"
              className="save-button"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>

            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate('/owner/my-properties')}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateProperty;
