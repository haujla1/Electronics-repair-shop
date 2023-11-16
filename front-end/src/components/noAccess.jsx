import SignOut from "./signOut"

const noAccess = () => {
    return (
        <>
        <h2>You do not have Access</h2>
        <p>Request Access here</p>
        <button>Request</button>
        <br />
        <SignOut />
        </>
    )
}

export default noAccess