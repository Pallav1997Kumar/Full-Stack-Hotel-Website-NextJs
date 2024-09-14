import UserDiningCartPageComponent from "@/components/Profile Page Component/User Cart Page Component/UserDiningCartPageComponent.jsx";

export function generateMetadata(){
    return {
        title: 'Account Dining Cart'
    }
}

export default function Page(){
    return (
        <div>
            <UserDiningCartPageComponent />
        </div>
    );
}