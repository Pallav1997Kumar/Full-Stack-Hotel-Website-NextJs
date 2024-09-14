import RoomsSuitesCartComponent from "@/components/Cart Page Component/RoomsSuitesCartComponent.jsx";


export function generateMetadata(){
    return {
        title: 'Rooms and Suites Carts'
    }
}


export default function Page(){
    return (
        <div>
            <RoomsSuitesCartComponent />
        </div>
    );
}