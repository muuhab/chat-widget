import { initialProfile } from '@/lib/initial-profile'
import { db } from '@/lib/db'

const SetupPage = async ({ }) => {
     await initialProfile()

    return <div
        className="h-full flex justify-center items-center 
"
    >
        <div className="text-center items-center flex flex-col">
            <h3 className="mt-2 text-2xl font-semibold ">
                Select a chat or start a new conversation
            </h3>
        </div>
    </div>
}

export default SetupPage