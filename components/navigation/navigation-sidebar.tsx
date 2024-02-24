import { ModeToggle } from "@/components/mode-toggle"
import { ScrollArea } from "@/components/ui/scroll-area"
import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { UserButton } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import NavigationItem from "./navigation-item"

const NavigationSidebar = async ({ }) => {
    const profile = await currentProfile()

    if (!profile) return redirect("/")

    const conversations = await db.profile.findMany({
        where: {
            id: {
                not: profile.id
            }
        }
    })


    return <div className="space-y-4 flex flex-col items-center h-full text-primary w-full dark:bg-[#1E1F22] bg-[#E3E5E8] py-3">
       
        <ScrollArea className="flex-1 w-full">
            {
                conversations.map((profile) => (
                    <div key={profile.id} className="mb-4">
                        <NavigationItem
                            id={profile.id}
                            name={profile.name}
                            imageUrl={profile.imageUrl}
                        />
                    </div>
                ))
            }
        </ScrollArea>
        <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
            <ModeToggle />
            <UserButton
                afterSignOutUrl="/"
                appearance={{
                    elements: {
                        avatarBox: "h-[48px] w-[48px]"
                    }
                }}
            />
        </div>
    </div>
}

export default NavigationSidebar