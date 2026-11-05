import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../ownerpagestyle/AddProperty.css';

function AddProperty() {

  const navigate = useNavigate();

  const ownerId = localStorage.getItem('userId');

  // ================= PROPERTY FORM =================

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
    status: 'AVAILABLE'
  });

  // ================= IMAGE & VIDEO =================

  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // ================= MESSAGES =================

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // ================= HANDLE FORM CHANGE =================

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  // ================= SELECT IMAGES =================

  const handleImageChange = (e) => {

    const files = Array.from(e.target.files);

    setSelectedImages(files);
  };

  // ================= REMOVE SELECTED IMAGE =================

  const removeSelectedImage = (index) => {

    setSelectedImages(
      selectedImages.filter((_, i) => i !== index)
    );
  };

  // ================= SELECT VIDEO =================

  const handleVideoChange = (e) => {

    const file = e.target.files[0];

    if (file) {
      setSelectedVideo(file);
    }
  };

  // ================= REMOVE SELECTED VIDEO =================

  const removeSelectedVideo = () => {

    setSelectedVideo(null);
  };

  // ================= SUBMIT PROPERTY =================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setSuccessMessage('');
    setErrorMessage('');

    if (!ownerId) {

      setErrorMessage('Owner login required.');

      return;
    }
    const token = localStorage.getItem('token');

  if (!token) {
  setErrorMessage('Login token not found. Please login again.');
  return;
}

    setLoading(true);

    // ================= PROPERTY DATA =================

    const propertyData = {

      owner: {
        userId: Number(ownerId)
      },

      title: formData.title,

      description: formData.description,

      propertyType: formData.propertyType,

      bhk: formData.bhk
        ? Number(formData.bhk)
        : null,

      rent: Number(formData.rent),

      deposit: Number(formData.deposit),

      city: formData.city,

      location: formData.location,

      address: formData.address,

      furnishing: formData.furnishing,

      availableFrom: formData.availableFrom,

      tenantPreference: formData.tenantPreference,

      status: formData.status
    };

    console.log(
      'Add Property Data:',
      propertyData
    );

    try {

      // ==================================================
      // STEP 1: CREATE PROPERTY
      // ==================================================

      const propertyResponse = await fetch(
        'http://localhost:8080/api/properties',
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify(propertyData)
        }
      );

      if (!propertyResponse.ok) {

        throw new Error(
          'Failed to add property'
        );
      }

      const property = await propertyResponse.json();

      console.log(
        'Property Added:',
        property
      );

      const propertyId = property.propertyId;

      console.log(
        'Created Property ID:',
        propertyId
      );


      // ==================================================
      // STEP 2: UPLOAD IMAGES
      // ==================================================

      for (const image of selectedImages) {

        const imageFormData = new FormData();

        imageFormData.append(
          'propertyId',
          propertyId
        );

        imageFormData.append(
          'file',
          image
        );

const imageResponse = await fetch(
  'http://localhost:8080/api/property-images/upload',
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: imageFormData
  }
);

        if (!imageResponse.ok) {

          throw new Error(
            `Failed to upload image: ${image.name}`
          );
        }

        const imageResult =
          await imageResponse.json();

        console.log(
          'Image Uploaded:',
          imageResult
        );
      }


      // ==================================================
      // STEP 3: UPLOAD VIDEO
      // ==================================================

      if (selectedVideo) {

        const videoFormData = new FormData();

        videoFormData.append(
          'propertyId',
          propertyId
        );

        videoFormData.append(
          'file',
          selectedVideo
        );

const videoResponse = await fetch(
  'http://localhost:8080/api/property-videos/upload',
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: videoFormData
  }
);

        if (!videoResponse.ok) {

          throw new Error(
            'Failed to upload property video'
          );
        }

        const videoResult =
          await videoResponse.json();

        console.log(
          'Video Uploaded:',
          videoResult
        );
      }


      // ==================================================
      // STEP 4: SUCCESS
      // ==================================================

      setSuccessMessage(
        'Property, images and video added successfully!'
      );


      // ==================================================
      // RESET FORM
      // ==================================================

      setFormData({

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

        status: 'AVAILABLE'
      });

      setSelectedImages([]);

      setSelectedVideo(null);

    } catch (error) {

      console.error(
        'Add Property Error:',
        error
      );

      setErrorMessage(
        error.message ||
        'Unable to add property. Please try again.'
      );

    } finally {

      setLoading(false);
    }
  };


  // ==================================================
  // UI
  // ==================================================

  return (

    <div className="add-property-page">


      {/* ================= NAVBAR ================= */}

      <nav className="owner-navbar">

        <div
          className="owner-logo"
          onClick={() =>
            navigate('/owner-dashboard')
          }
        >
          ZERO BROKER
        </div>


        <div className="owner-nav-links">

          <button
            onClick={() =>
              navigate('/owner-dashboard')
            }
          >
            Dashboard
          </button>


          <button className="active">
            Add Property
          </button>


          <button
            onClick={() =>
              navigate('/owner/my-properties')
            }
          >
            My Properties
          </button>


          <button>
            Interested Users
          </button>


          <button onClick={() => navigate('/owner/profile')}>
            Profile
          </button>


          <button
            onClick={() => {

              localStorage.removeItem(
                'userId'
              );

              localStorage.removeItem(
                'roleName'
              );

              localStorage.removeItem('token');

              navigate('/');
            }}
          >
            Logout
          </button>

        </div>

      </nav>


      {/* ================= MAIN CONTAINER ================= */}

      <div className="add-property-container">

        <h1>
          Add Property
        </h1>


        <p className="add-property-subtitle">
          Add your property details
        </p>


        {/* ================= SUCCESS ================= */}

        {successMessage && (

          <div className="success-message">

            {successMessage}

          </div>
        )}


        {/* ================= ERROR ================= */}

        {errorMessage && (

          <div className="error-message">

            {errorMessage}

          </div>
        )}


        {/* ================= FORM ================= */}

        <form
          className="add-property-form"
          onSubmit={handleSubmit}
        >


          {/* PROPERTY TITLE */}

          <div className="form-group">

            <label>
              Property Title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Example: Spacious 2 BHK Flat"
              required
            />

          </div>


          {/* DESCRIPTION */}

          <div className="form-group">

            <label>
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter property description"
              required
            />

          </div>


          {/* PROPERTY TYPE + BHK */}

          <div className="form-row">


            <div className="form-group">

              <label>
                Property Type
              </label>

              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select Property Type
                </option>

                <option value="1 RK">
                  1 RK
                </option>

                <option value="1 BHK">
                  1 BHK
                </option>

                <option value="2 BHK">
                  2 BHK
                </option>

                <option value="3 BHK">
                  3 BHK
                </option>

                <option value="1 HALL">
                  1 HALL
                </option>

                <option value="STUDIO">
                  STUDIO
                </option>

              </select>

            </div>


            <div className="form-group">

              <label>
                BHK
              </label>

              <select
                name="bhk"
                value={formData.bhk}
                onChange={handleChange}
              >

                <option value="">
                  Not Applicable
                </option>

                <option value="1">
                  1 BHK
                </option>

                <option value="2">
                  2 BHK
                </option>

                <option value="3">
                  3 BHK
                </option>

                <option value="4">
                  4 BHK
                </option>

              </select>

            </div>

          </div>


          {/* RENT + DEPOSIT */}

          <div className="form-row">


            <div className="form-group">

              <label>
                Rent
              </label>

              <input
                type="number"
                name="rent"
                value={formData.rent}
                onChange={handleChange}
                placeholder="Monthly Rent"
                required
              />

            </div>


            <div className="form-group">

              <label>
                Deposit
              </label>

              <input
                type="number"
                name="deposit"
                value={formData.deposit}
                onChange={handleChange}
                placeholder="Security Deposit"
                required
              />

            </div>

          </div>


          {/* CITY + LOCATION */}

          <div className="form-row">


            <div className="form-group">

              <label>
                City
              </label>

              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Example: Pune"
                required
              />

            </div>


            <div className="form-group">

              <label>
                Location
              </label>

              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Example: Baner"
                required
              />

            </div>

          </div>


          {/* ADDRESS */}

          <div className="form-group">

            <label>
              Address
            </label>

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Complete property address"
              required
            />

          </div>


          {/* FURNISHING + AVAILABLE DATE */}

          <div className="form-row">


            <div className="form-group">

              <label>
                Furnishing
              </label>

              <select
                name="furnishing"
                value={formData.furnishing}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select Furnishing
                </option>

                <option value="UNFURNISHED">
                  UNFURNISHED
                </option>

                <option value="SEMI-FURNISHED">
                  SEMI-FURNISHED
                </option>

                <option value="FULLY-FURNISHED">
                  FULLY-FURNISHED
                </option>

              </select>

            </div>


            <div className="form-group">

              <label>
                Available From
              </label>

              <input
                type="date"
                name="availableFrom"
                value={formData.availableFrom}
                onChange={handleChange}
                required
              />

            </div>

          </div>


          {/* TENANT PREFERENCE + STATUS */}

          <div className="form-row">


            <div className="form-group">

              <label>
                Tenant Preference
              </label>

              <select
                name="tenantPreference"
                value={formData.tenantPreference}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select Preference
                </option>

                <option value="FAMILY">
                  FAMILY
                </option>

                <option value="BACHELOR">
                  BACHELOR
                </option>

                <option value="GIRLS">
                  GIRLS
                </option>

                <option value="BOYS">
                  BOYS
                </option>

              </select>

            </div>


            <div className="form-group">

              <label>
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >

                <option value="AVAILABLE">
                  AVAILABLE
                </option>

                <option value="RENTED">
                  RENTED
                </option>

              </select>

            </div>

          </div>


          {/* ==================================================
              PROPERTY IMAGES
          ================================================== */}

          <div className="upload-section">

            <h3>
              Property Images
            </h3>


            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />


            {selectedImages.length > 0 && (

              <div className="selected-files">

                {selectedImages.map(
                  (image, index) => (

                    <div
                      key={index}
                      className="selected-file"
                    >

                      <span>
                        📷 {image.name}
                      </span>


                      <button
                        type="button"
                        onClick={() =>
                          removeSelectedImage(
                            index
                          )
                        }
                      >
                        ❌
                      </button>

                    </div>

                  )
                )}

              </div>

            )}

          </div>


          {/* ==================================================
              PROPERTY VIDEO
          ================================================== */}

          <div className="upload-section">

            <h3>
              Property Video
            </h3>


            <input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
            />


            {selectedVideo && (

              <div className="selected-file">

                <span>
                  🎥 {selectedVideo.name}
                </span>


                <button
                  type="button"
                  onClick={
                    removeSelectedVideo
                  }
                >
                  ❌
                </button>

              </div>

            )}

          </div>


          {/* ==================================================
              ADD PROPERTY BUTTON
          ================================================== */}

          <button
            type="submit"
            className="add-property-button"
            disabled={loading}
          >

            {loading
              ? 'Adding Property...'
              : 'Add Property'
            }

          </button>


        </form>

      </div>

    </div>
  );
}

export default AddProperty;

