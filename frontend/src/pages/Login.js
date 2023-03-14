
import { useGoogleLogin, GoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const GOOGLE_CLIENT_ID= "500610709749-4f8bvpuvfes6ig395sh35r3398e6t7oc.apps.googleusercontent.com";
const CLIENTSECRET= "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";
const CALLBACK_URL= "http://localhost:3000/auth/google";


function Auth() {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = useState(null);
  return (
    <div>
      <GoogleLogin
        onSuccess={credentialResponse => {
          setAccessToken(credentialResponse)
          console.log(credentialResponse);
          navigate(`/dashboard?accessToken=${credentialResponse.credential}`);
        }}
        onError={() => {
          console.log('Login Failed');
        }}
      />
    </div>
  );

}


function Login() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Auth />
    </GoogleOAuthProvider>
  );
}

export default Login;


