import Login from "@/components/Authentication Component/Login.jsx";


export function generateMetadata(){
    return {
        title: 'Royal Palace- Login'
    }
}

export default function Page(){
    return(
        <div>
            <Login />
        </div>
    );
}