'use client';
import { useState, useEffect } from "react";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { getUsers, User } from "@/lib/users";

export default function UserCard() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersData = await getUsers();
                setUsers(usersData);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);

    return (
        users.map(user => (
            <Card className="w-full max-w-sm" key={user.id}>
                <CardHeader>
                    <CardTitle>{user.first_name} {user.last_name}</CardTitle>
                    <CardDescription>
                        {user.email}
                    </CardDescription>
                </CardHeader>
            </Card>
        ))
    );
}