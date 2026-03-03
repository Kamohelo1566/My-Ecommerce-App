import { SignIn } from '@clerk/clerk-react'
import React from 'react'

function LoginPage() {
  return (
    <div>LoginPage

      {/* clerk sign in component */}
      <SignIn/>

    </div>
  );
}

export default LoginPage;