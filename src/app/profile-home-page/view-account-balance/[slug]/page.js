import ViewAccountBalance from "@/components/Profile Page Component/Account Balance Component/ViewAccountBalance.jsx"

export function generateMetadata(){
    return {
        title: 'View Account Balance'
    }
}

export default function Page(){
    return (
        <div>
            <ViewAccountBalance />    
        </div>
    );
}