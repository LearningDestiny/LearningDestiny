import { useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export default function ManageUsers() {
  const { user } = useUser();
  const { clerk } = useClerk();
  const [users, setUsers] = useState([]);
  const [referrals, setReferrals] = useState({});
  const [newReferral, setNewReferral] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/fetch-users");
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
    fetchUsers();
  }, []);

  async function handleAddReferral(userId) {
    try {
      await axios.post("/api/manage-referrals", { userId, referral: newReferral });
      setReferrals({ ...referrals, [userId]: newReferral });
      setNewReferral("");
    } catch (error) {
      console.error("Error adding referral:", error);
    }
  }

  async function handleDeleteReferral(userId) {
    try {
      await axios.delete("/api/manage-referrals", { data: { userId } });
      const updatedReferrals = { ...referrals };
      delete updatedReferrals[userId];
      setReferrals(updatedReferrals);
    } catch (error) {
      console.error("Error deleting referral:", error);
    }
  }

  async function handleResetPassword(userId) {
    try {
      await axios.post("/api/reset-passwords", { userId });
      alert("Password reset email sent!");
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  }

  async function handleDeactivateAccount(userId) {
    try {
      await axios.post("/api/deactivate-account", { userId });
      alert("Account deactivated successfully!");
    } catch (error) {
      console.error("Error deactivating account:", error);
    }
  }

  async function handleDownloadDetails(userId) {
    try {
      setLoading(true);
      const res = await axios.get(`/api/download-details?userId=${userId}`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `User_${userId}_Details.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading details:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDownloadFiles(userId) {
    try {
      setLoading(true);
      const res = await axios.get(`/api/download-files?userId=${userId}`, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `User_${userId}_Files.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading files:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Manage Users</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <Card key={user.id} className="shadow-md rounded-lg">
            <CardHeader>
              <CardTitle className="text-lg">{user.email}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-2">
                Referral: {referrals[user.id] || "No Referral"}
              </p>
              <Input
                value={newReferral}
                onChange={(e) => setNewReferral(e.target.value)}
                placeholder="Enter Referral"
                className="mb-2"
              />
              <div className="flex gap-2">
                <Button onClick={() => handleAddReferral(user.id)}>Add</Button>
                <Button onClick={() => handleDeleteReferral(user.id)} variant="destructive">
                  Delete
                </Button>
              </div>
              <hr className="my-3" />
              <div className="flex flex-col gap-2">
                <Button onClick={() => handleResetPassword(user.id)} variant="outline">
                  Reset Password
                </Button>
                <Button onClick={() => handleDeactivateAccount(user.id)} variant="destructive">
                  Deactivate Account
                </Button>
                <Button onClick={() => handleDownloadDetails(user.id)} disabled={loading}>
                  {loading ? "Downloading..." : "Download Details"}
                </Button>
                <Button onClick={() => handleDownloadFiles(user.id)} disabled={loading}>
                  {loading ? "Downloading..." : "Download Files"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
