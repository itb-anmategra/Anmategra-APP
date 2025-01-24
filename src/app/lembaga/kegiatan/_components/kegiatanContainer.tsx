"use client"

import { useState, useEffect} from "react"
import { useDebounce } from "~/components/debounceHook";
import {Search, Plus, ChevronRight, Filter} from "lucide-react"
import {Button} from "~/components/ui/button"
import {Input} from "~/components/ui/input"

export interface Activity {
    id: string
    name: string
    description: string | null
    start_date: string
    participant_count: number | null;
    status: "Coming Soon" | "On going" | "Ended";
    thumbnail: string | null
}

export default function ActivityList(
    {propActivites}: { propActivites: Activity[] }
) {
    const [activities, setActivities] = useState<Activity[]>(propActivites)
    const [searchQuery, setSearchQuery] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    useEffect(() => {
        const getActivities = async () => {
            setIsLoading(true);
            const filteredActivities = propActivites.filter(activity =>
                activity.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
            );
            setActivities(filteredActivities);
            setIsLoading(false);
        };
        getActivities();
    }, [debouncedSearchQuery, propActivites]);

    return (
        <div className="p-4 max-w-7xl mx-auto space-y-4">
            <h1 className="text-2xl font-semibold">Kegiatan</h1>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4"/>
                    <Input
                        type="text"
                        placeholder="Cari nama kegiatan"
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex gap-2">
                    <Button className="bg-teal-500 hover:bg-teal-600">
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Kegiatan Baru
                    </Button>
                    <Button variant="outline">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="min-w-full">
                    <div className="grid grid-cols-[80px_1fr_120px_100px_100px_50px] gap-4 p-4 bg-gray-50 text-sm font-medium text-gray-500">
                        <div>Thumbnail</div>
                        <div>Judul</div>
                        <div>Tanggal</div>
                        <div>Panitia</div>
                        <div>Status</div>
                        <div></div>
                    </div>

                    <div className="divide-y divide-gray-200">
                        {activities.map((activity, index) => (
                            <div
                                key={activity.id}
                                className="grid grid-cols-[80px_1fr_120px_100px_100px_50px] gap-4 p-4 items-center hover:bg-gray-50 transition-colors"
                            >
                                <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden">
                                    {activity.thumbnail && (
                                        <img src={activity.thumbnail || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-medium">{activity.name}</h3>
                                    <p className="text-sm text-gray-500 truncate">{activity.description}</p>
                                </div>
                                <div className="text-sm text-gray-500">{activity.start_date}</div>
                                <div className="text-sm text-gray-500">{activity.participant_count}</div>
                                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {activity.status}
                  </span>
                                </div>
                                <Button variant="ghost" size="icon">
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {isLoading && <div className="p-4 text-center text-gray-500">Loading activities...</div>}

                {!isLoading && activities.length === 0 && (
                    <div className="p-8 text-center text-gray-500">No activities found</div>
                )}
            </div>
        </div>
    )
}

