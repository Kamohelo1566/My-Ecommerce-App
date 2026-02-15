import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';

function App() {
  return ( <div>
    <h1>HOME PAGE</h1>

     <SignedOut>
        <SignInButton mode="modal"/>
        <SignUpButton />
      </SignedOut>
      {/* Show the user button when the user is signed in */}
      <SignedIn>
        <UserButton />
      </SignedIn>
  </div>
  );
}

export default App;