import { useAppContext } from "../context/appContext";

function Dashboard() {

    //using global values
    const {user} = useAppContext()


    return (
        <div>
            Dashboard
            <p>
            Welcome {user ? user.name : 'Guest'}!
            </p>
        </div>
    );
}
  
export default Dashboard;