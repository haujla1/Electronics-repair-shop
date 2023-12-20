import { doSignOut } from "../firebase/firebaseFunctions";

const signOut = () => {
  return (
    <button className="signOut" onClick={doSignOut}>
      Sign Out
    </button>
  );
};

export default signOut;
