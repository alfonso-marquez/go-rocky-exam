'use client';
import { useState, useEffect } from "react";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { getUsers, Profile } from "@/lib/users";

export default function UserCard() {
    const [profiles, setProfile] = useState<Profile[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersData = await getUsers();
                setProfile(usersData);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);

    return (
        profiles.map(profile => (
            <Card className="w-full max-w-sm" key={profile.id}>
                <CardHeader>
                    <CardTitle>{profile.first_name} {profile.last_name}</CardTitle>
                    <CardDescription>
                        {profile.email}
                    </CardDescription>
                </CardHeader>
            </Card>
        ))
    );
}