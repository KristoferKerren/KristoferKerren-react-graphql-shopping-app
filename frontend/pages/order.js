import PleaseSignIn from '../components/PleaseSignIn';
import SingleOrder from '../components/SingleOrder';

export default function SingleOrderPage({ query }) {
  return (
    <PleaseSignIn>
      <SingleOrder id={query.id} />
    </PleaseSignIn>
  );
}
