import DiningCartComponent from "@/components/Cart Page Component/DiningCartComponent.jsx";


export function generateMetadata(){
    return {
        title: 'Dining Carts'
    }
}


export default function Page(){
    return (
        <div>
            <DiningCartComponent />
        </div>
    );
}