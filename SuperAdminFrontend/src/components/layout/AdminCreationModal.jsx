// src/components/AdminCreationModal.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const AdminCreationModal = ({ open, onClose, elections = [], onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profile_picture: null,
    election_id: "",
    admin_of_state: "",
  });

  const statesAndUTs = [
    // States
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",

    // Union Territories
    "Andaman and Nicobar Islands",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Delhi",
    "Jammu and Kashmir",
    "Ladakh",
    "Lakshadweep",
    "Puducherry",
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare FormData for file upload
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    if (onSubmit) onSubmit(data);
    onClose(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Admin</DialogTitle>
          <DialogDescription>
            Fill in details to register a new admin
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Profile Picture */}
          <div>
            <Label htmlFor="profile_picture">Profile Picture</Label>
            <Input
              type="file"
              name="profile_picture"
              accept="image/*"
              onChange={handleChange}
            />
          </div>

          {/* Election ID (Dropdown) */}
          <div>
            <Label htmlFor="election_id">Election</Label>
            <Select
              onValueChange={(val) =>
                setFormData((prev) => ({ ...prev, election_id: val }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select election" />
              </SelectTrigger>
              <SelectContent>
                {elections.length > 0 ? (
                  elections.map((e) => (
                    <SelectItem
                      key={e.election_id}
                      value={e.election_id.toString()}
                    >
                      {e.title || `Election ${e.election_id}`}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="0" disabled>
                    No elections available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Admin of State */}
          <div className="space-y-2">
            <Label htmlFor="admin_of_state">Admin of State</Label>
            <select
              id="admin_of_state"
              name="admin_of_state"
              value={formData.admin_of_state}
              onChange={handleChange}
              className="w-full border rounded-lg p-2"
              required
            >
              <option value="">-- Select State / UT --</option>
              {statesAndUTs.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => onClose(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create Admin</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdminCreationModal;
