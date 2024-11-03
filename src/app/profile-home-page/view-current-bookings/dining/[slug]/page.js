import UserCurrentDiningBookingPage from "@/components/Profile Page Component/User Current Booking Page Component/UserCurrentDiningBookingPage.jsx";

export function generateMetadata(){
    return {
        title: 'View Current Dining Booking'
    }
}

export default function Page(){
    return (
        <div>
            <UserCurrentDiningBookingPage />
        </div>
    );
}