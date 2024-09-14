import EventMeetingRoomCartComponent from "@/components/Cart Page Component/EventMeetingRoomCartComponent.jsx";


export function generateMetadata(){
    return {
        title: 'Event Meeting Carts'
    }
}


export default function Page(){
    return (
        <div>
            <EventMeetingRoomCartComponent />
        </div>
    );
}