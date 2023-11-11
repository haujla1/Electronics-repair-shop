import { doSignOut } from "../firebase/firebaseFunctions";


const signOut = () => {
    return(
        <button onClick={doSignOut}>Sign Out</button>
    )
}


export default signOut