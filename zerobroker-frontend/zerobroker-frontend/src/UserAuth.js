import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './App.css';

function UserAuth() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isRegister, setIsRegister] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const [forgotEmail, setForgotEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const [message, setMessage] = useState('');

  // LOGIN STATE
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // REGISTER STATE
  const [registerFullName, setRegisterFullName] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerCity, setRegisterCity] = useState('');

  // ROLE
  const roleName =
    location.pathname === '/owner-auth' ? 'OWNER' : 'USER';

  // Safely read JSON or empty responses
  const parseResponse = async (response) => {
    const responseText = await response.text();

    if (!responseText.trim()) {
      return {};
    }

    try {
      return JSON.parse(responseText);
    } catch {
      return { message: responseText };
    }
  };

  // OTP COUNTDOWN
  useEffect(() => {
    if (!otpSent || otpVerified || timeLeft <= 0) {
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearTimeout(timer);
  }, [otpSent, otpVerified, timeLeft]);

  // ================= LOGIN =================
  const handleLogin = async () => {
    if (!loginEmail.trim() || !loginPassword) {
      setMessage('Please enter email and password');
      return;
    }

    try {
      const response = await fetch(
        'http://localhost:8080/api/users/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            email: loginEmail.trim(),
            password: loginPassword
          })
        }
      );

      const result = await parseResponse(response);

      console.log('Login API response:', {
        status: response.status,
        userId: result.userId,
        roleName: result.roleName,
        tokenReceived: Boolean(
          result.token || result.jwtToken || result.accessToken
        ),
        responseFields: Object.keys(result)
      });

if (!response.ok) {
  if (response.status === 401 || response.status === 403) {
    setMessage('Invalid email or password.');
  } else {
    setMessage(
      result.message || `Login failed. Status: ${response.status}`
    );
  }

  return;
}

      // Read JWT token returned by the backend
      const token =
        result.token ||
        result.jwtToken ||
        result.accessToken;

      if (!token) {
        console.error(
          'JWT token missing from login response.',
          result
        );

        setMessage(
          'JWT token missing in login response. Please check LoginResponse.java.'
        );
        return;
      }

      if (!result.userId || !result.roleName) {
        console.error('Required login fields are missing:', result);

        setMessage(
          'User ID or role is missing from login response.'
        );
        return;
      }

      // Save login details and JWT
      localStorage.setItem('token', token);
      localStorage.setItem('userId', String(result.userId));
      localStorage.setItem('roleName', result.roleName);

      // Remove old alternative token keys
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('jwt');
      localStorage.removeItem('accessToken');

      setMessage('Login successful');

      setTimeout(() => {
        if (result.roleName === 'OWNER') {
          navigate('/owner-dashboard');
        } else if (result.roleName === 'USER') {
          navigate('/user-dashboard');
        } else if (result.roleName === 'ADMIN') {
          navigate('/admin-dashboard');
        } else {
          setMessage('Invalid role returned by server');
        }
      }, 500);

    } catch (error) {
      console.error('Login Error:', error);

      setMessage(
        'Unable to connect to server. Check backend and browser console.'
      );
    }
  };

  // ================= REGISTER =================
  const handleRegister = async () => {
    if (
      !registerFullName.trim() ||
      !loginEmail.trim() ||
      !loginPassword ||
      !registerPhone.trim() ||
      !registerCity.trim()
    ) {
      setMessage('Please fill all fields');
      return;
    }

    try {
      const response = await fetch(
        'http://localhost:8080/api/users/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            fullName: registerFullName.trim(),
            email: loginEmail.trim(),
            password: loginPassword,
            phone: registerPhone.trim(),
            city: registerCity.trim(),
            roleName
          })
        }
      );

      const result = await parseResponse(response);

      if (!response.ok) {
        setMessage(
          result.message ||
          `Registration failed. Status: ${response.status}`
        );
        return;
      }

      setMessage(
        `${roleName} registration successful. Please login.`
      );

      setRegisterFullName('');
      setRegisterPhone('');
      setRegisterCity('');
      setLoginEmail('');
      setLoginPassword('');

      setTimeout(() => {
        setIsRegister(false);
        setMessage('');
      }, 1500);

    } catch (error) {
      console.error('Registration Error:', error);
      setMessage('Unable to connect to server');
    }
  };

  // ================= SEND / RESEND OTP =================
  const handleSendOtp = async () => {
    if (!forgotEmail.trim()) {
      setMessage('Please enter your email address');
      return;
    }

    try {
      const response = await fetch(
        'http://localhost:8080/api/users/forgot-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'text/plain'
          },
          body: JSON.stringify({
            email: forgotEmail.trim()
          })
        }
      );

      const result = await response.text();

      if (!response.ok) {
        setMessage(result || `Failed to send OTP. Status: ${response.status}`);
        return;
      }

      setMessage(result);

      if (
        result.toLowerCase().includes('otp sent successfully')
      ) {
        setOtpSent(true);
        setOtpVerified(false);
        setOtp('');
        setTimeLeft(60);
      }

    } catch (error) {
      console.error('Send OTP Error:', error);
      setMessage('Unable to connect to server');
    }
  };

  // ================= VERIFY OTP =================
  const handleVerifyOtp = async () => {
    if (timeLeft <= 0) {
      setMessage('OTP expired. Please request a new OTP.');
      return;
    }

    if (!otp) {
      setMessage('Please enter OTP');
      return;
    }

    try {
      const response = await fetch(
        'http://localhost:8080/api/users/verify-otp',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'text/plain'
          },
          body: JSON.stringify({
            email: forgotEmail.trim(),
            otp
          })
        }
      );

      const result = await response.text();

      if (!response.ok) {
        setMessage(result || `OTP verification failed. Status: ${response.status}`);
        return;
      }

      setMessage(result);

      if (result.trim() === 'OTP verified successfully') {
        setOtpVerified(true);
        setTimeLeft(0);
      }

    } catch (error) {
      console.error('Verify OTP Error:', error);
      setMessage('Unable to connect to server');
    }
  };

  // ================= RESET PASSWORD =================
  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setMessage('Please enter both passwords');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const response = await fetch(
        'http://localhost:8080/api/users/reset-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'text/plain'
          },
          body: JSON.stringify({
            email: forgotEmail.trim(),
            newPassword,
            confirmPassword
          })
        }
      );

      const result = await response.text();

      if (!response.ok) {
        setMessage(result || `Password reset failed. Status: ${response.status}`);
        return;
      }

      setMessage(result);

      if (result.trim() === 'Password reset successfully') {
        setTimeout(() => {
          setShowForgotPassword(false);
          setOtpSent(false);
          setOtpVerified(false);
          setTimeLeft(0);

          setForgotEmail('');
          setOtp('');
          setNewPassword('');
          setConfirmPassword('');
          setMessage('');
        }, 1500);
      }

    } catch (error) {
      console.error('Reset Password Error:', error);
      setMessage('Unable to connect to server');
    }
  };

  // ================= FORGOT PASSWORD PAGE =================
  if (showForgotPassword) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">🔐</div>
          <h1>ZERO BROKER</h1>

          {!otpSent && (
            <>
              <p className="auth-subtitle">Forgot Password</p>
              <p className="forgot-info">
                Enter your registered email address to reset
                your password.
              </p>

              <input
                type="email"
                placeholder="Email Address"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
              />

              <button
                type="button"
                className="auth-button"
                onClick={handleSendOtp}
              >
                Send OTP
              </button>
            </>
          )}

          {otpSent && !otpVerified && (
            <>
              <p className="auth-subtitle">Verify OTP</p>
              <p className="forgot-info">
                Enter the OTP sent to your email.
              </p>

              {timeLeft > 0 ? (
                <p className="forgot-info">
                  OTP expires in:{' '}
                  <strong>
                    00:{String(timeLeft).padStart(2, '0')}
                  </strong>
                </p>
              ) : (
                <>
                  <p className="forgot-info">
                    OTP expired. Please request a new OTP.
                  </p>
                  <button
                    type="button"
                    className="auth-button"
                    onClick={handleSendOtp}
                  >
                    Resend OTP
                  </button>
                </>
              )}

              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))
                }
                maxLength={6}
                inputMode="numeric"
                disabled={timeLeft === 0}
              />

              <button
                type="button"
                className="auth-button"
                onClick={handleVerifyOtp}
                disabled={timeLeft === 0}
              >
                Verify OTP
              </button>
            </>
          )}

          {otpVerified && (
            <>
              <p className="auth-subtitle">Reset Password</p>
              <p className="forgot-info">
                Enter your new password.
              </p>

              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button
                type="button"
                className="auth-button"
                onClick={handleResetPassword}
              >
                Reset Password
              </button>
            </>
          )}

          {message && (
            <p className="auth-message">{message}</p>
          )}

          {!otpSent && (
            <div className="auth-switch">
              <span
                className="switch-button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setMessage('');
                }}
              >
                ← Back to Login
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ================= LOGIN / REGISTER PAGE =================
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🏠</div>
        <h1>ZERO BROKER</h1>

        <p className="auth-subtitle">
          {isRegister
            ? 'Create your account'
            : 'Welcome back! Login to continue'}
        </p>

        {isRegister && (
          <>
            <input
              type="text"
              placeholder="Full Name"
              value={registerFullName}
              onChange={(e) => setRegisterFullName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={registerPhone}
              onChange={(e) => setRegisterPhone(e.target.value)}
            />
          </>
        )}

        <input
          type="email"
          placeholder="Email Address"
          value={loginEmail}
          onChange={(e) => setLoginEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={loginPassword}
          onChange={(e) => setLoginPassword(e.target.value)}
        />

        {!isRegister && (
          <div className="forgot-password">
            <span
              onClick={() => {
                setShowForgotPassword(true);
                setMessage('');
                setForgotEmail('');
                setOtp('');
                setOtpSent(false);
                setOtpVerified(false);
                setTimeLeft(0);
              }}
            >
              Forgot Password?
            </span>
          </div>
        )}

        {isRegister && (
          <input
            type="text"
            placeholder="City"
            value={registerCity}
            onChange={(e) => setRegisterCity(e.target.value)}
          />
        )}

        <button
          type="button"
          className="auth-button"
          onClick={isRegister ? handleRegister : handleLogin}
        >
          {isRegister ? 'Register' : 'Login'}
        </button>

        {message && (
          <p className="auth-message">{message}</p>
        )}

        <div className="auth-switch">
          <span>
            {isRegister
              ? 'Already have an account?'
              : "Don't have an account?"}
          </span>

          <span
            className="switch-button"
            onClick={() => {
              setIsRegister(!isRegister);
              setMessage('');
            }}
          >
            {isRegister ? 'Login' : 'Register'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default UserAuth;
