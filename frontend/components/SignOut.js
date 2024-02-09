import { useMutation } from '@apollo/client';
import { CURRENT_USER_QUERY, SIGNOUT_MUTATION } from '../lib/queries';

export default function SignOut() {
  const [signOut] = useMutation(SIGNOUT_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });

  const signOutAndRedirect = async () => {
    await signOut();
    window.location.href = '/';
  };

  return (
    <button type="button" onClick={signOutAndRedirect}>
      Sign Out
    </button>
  );
}
