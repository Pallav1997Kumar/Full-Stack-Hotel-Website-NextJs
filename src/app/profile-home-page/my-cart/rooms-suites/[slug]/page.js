import UserRoomsSuitesCartPageComponent from "@/components/Profile Page Component/User Cart Page Component/UserRoomsSuitesCartPageComponent.jsx";

export function generateMetadata(){
    return {
        title: 'Account Rooms and Suites Cart'
    }
}

export default function Page(){
    return (
        <div>
            <UserRoomsSuitesCartPageComponent />
        </div>
    );
}