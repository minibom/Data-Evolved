// src/app/social/friends/page.tsx
"use client";
// import FriendsList from "@/components/FriendsList"; // Future component

export default function FriendsListPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold font-headline mb-6">My Friends</h1>
      {/* <FriendsList /> */}
       <div className="p-6 bg-card border rounded-lg shadow">
        <p className="text-muted-foreground">Your friend list, pending requests, and add friend functionality.</p>
        <p className="text-sm mt-2">Placeholder for FriendsList component.</p>
      </div>
    </div>
  );
}
