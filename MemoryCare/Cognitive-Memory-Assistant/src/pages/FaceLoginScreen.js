import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, AlertCircle, AlertTriangle } from 'lucide-react';
import '../styles/FaceLoginScreen.css';
import Navigation from '../components/Navigation';

function FaceLoginScreen() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [authStatus, setAuthStatus] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [cameraError, setCameraError] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  // Initialize camera on mount
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraReady(true);
          setCameraError(null);
        }
      } catch (error) {
        setCameraError(error.name || 'Unable to access camera');
        setIsCameraReady(false);
      }
    };

    startCamera();

    const video = videoRef.current;

    // Cleanup: Stop camera stream on unmount
    return () => {
      if (video && video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleScanFace = () => {
    if (isScanning || !isCameraReady) return;
    
    setIsScanning(true);
    setAuthStatus(null);
    
    // Simulate face scanning with real camera
    setTimeout(() => {
      const success = Math.random() > 0.3;
      if (success) {
        setAuthStatus('success');
        setAttempts(0);
      } else {
        setAuthStatus('failed');
        setAttempts(attempts + 1);
      }
      setIsScanning(false);
    }, 3000);
  };

  const handleTryAgain = () => {
    setAuthStatus(null);
    handleScanFace();
  };

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  return (
    <div className="face-login-page">
      <div className="face-login-container">
        <div className="face-login-content">
          <div className="face-header">
            <h1 className="face-title">Face Authentication</h1>
            <p className="face-subtitle">Verify your identity</p>
          </div>

          <div className="face-scanner">
            <div className={`camera-frame ${isScanning ? 'scanning' : ''} ${authStatus ? authStatus : ''}`}>
              {cameraError ? (
                <div className="camera-error">
                  <AlertTriangle size={60} />
                  <p className="error-title">{cameraError}</p>
                  <p className="error-details">
                    {cameraError === 'NotAllowedError' 
                      ? 'Please allow camera access permissions in your browser settings' 
                      : 'Please ensure your device has a camera and try again'}
                  </p>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    className="camera-video"
                    autoPlay
                    playsInline
                    muted
                  />
                  <div className="scanning-overlay"></div>
                  
                  {isScanning && (
                    <div className="scanning-text">
                      <p>Scanning...</p>
                      <div className="scanning-dots">
                        <span></span><span></span><span></span>
                      </div>
                    </div>
                  )}

                  {authStatus === 'success' && (
                    <div className="status-overlay success">
                      <Check size={80} />
                      <p>Authentication Successful!</p>
                    </div>
                  )}

                  {authStatus === 'failed' && (
                    <div className="status-overlay failed">
                      <AlertCircle size={80} />
                      <p>Face not recognized</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="face-instructions">
            <h3>Instructions:</h3>
            <ul>
              <li>Position your face in the center of the frame</li>
              <li>Ensure good lighting</li>
              <li>Look directly at the camera</li>
              <li>Keep your face steady</li>
            </ul>
          </div>

          <div className="face-buttons">
            {!authStatus && !cameraError && (
              <button
                className="scan-btn"
                onClick={handleScanFace}
                disabled={isScanning || !isCameraReady}
              >
                {isScanning ? 'Scanning...' : '📱 Scan Face'}
              </button>
            )}

            {!authStatus && cameraError && (
              <button
                className="scan-btn"
                disabled
                title="Camera access required"
              >
                📱 Camera Unavailable
              </button>
            )}

            {authStatus === 'failed' && attempts < 3 && (
              <button className="retry-btn" onClick={handleTryAgain}>
                Try Again
              </button>
            )}

            {authStatus === 'success' && (
              <button className="success-btn" onClick={handleGoHome}>
                Go to Home
              </button>
            )}

            {attempts >= 3 && authStatus === 'failed' && (
              <div className="max-attempts-message">
                <p>Maximum attempts reached. Please try again later.</p>
              </div>
            )}
          </div>

          <button className="back-btn" onClick={handleGoHome}>
            ← Back
          </button>
        </div>
      </div>
      <Navigation />
    </div>
  );
}

export default FaceLoginScreen;
