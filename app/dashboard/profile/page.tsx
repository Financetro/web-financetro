"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, User, Mail, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [name, setName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      let finalPhotoURL = photoURL;

      if (file) {
        const storageRef = ref(storage, `users/${user.uid}/profile`);
        await uploadBytes(storageRef, file);
        finalPhotoURL = await getDownloadURL(storageRef);
      }

      await updateProfile(user, {
        displayName: name,
        photoURL: finalPhotoURL,
      });

      await setDoc(doc(db, "users", user.uid), {
        name,
        updatedAt: new Date(),
        ...(finalPhotoURL && { photoURL: finalPhotoURL })
      }, { merge: true });

      setPhotoURL(finalPhotoURL);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPhotoURL(URL.createObjectURL(selectedFile));
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile & Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account preferences and personal info.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
         <Card className="glass md:col-span-1">
          <CardHeader>
             <CardTitle className="text-sm text-center text-muted-foreground uppercase tracking-wider font-semibold">Avatar</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative group cursor-pointer w-32 h-32 mb-6">
              <div className="w-full h-full rounded-full bg-[linear-gradient(to_tr,var(--color-primary),var(--color-primary-hover))] flex items-center justify-center text-4xl text-primary-foreground font-bold shadow-xl ring-4 ring-background overflow-hidden relative border border-white/10 z-10 transition-transform group-hover:scale-105">
                {photoURL ? (
                  <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span>{name ? name.charAt(0).toUpperCase() : "U"}</span>
                )}
              </div>
              
              <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <Camera className="text-white h-8 w-8" />
              </div>
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30" 
                onChange={handleFileChange}
                accept="image/*"
              />
              
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150 -z-10 group-hover:bg-primary/30 transition-colors"></div>
            </div>
            
            <h3 className="text-xl font-bold text-center mb-1">{name || "Unnamed User"}</h3>
            <p className="text-xs text-muted-foreground text-center truncate w-full px-4">{user.email}</p>
          </CardContent>
         </Card>

         <Card className="glass md:col-span-2">
            <CardHeader className="border-b border-white/5 bg-white/[0.02]">
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center text-muted-foreground hover:text-white transition-colors">
                      <User className="h-4 w-4 mr-2" />
                      Full Name
                    </Label>
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      className="bg-background/50 border-white/10 focus:border-primary/50 transition-colors h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center text-muted-foreground hover:text-white transition-colors">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Address
                    </Label>
                    <Input 
                      id="email" 
                      value={user.email || ""} 
                      disabled
                      className="bg-background/20 border-white/5 opacity-50 cursor-not-allowed h-11"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end pt-6 border-t border-white/5">
                  <Button type="submit" disabled={loading} className="h-11 px-8 shadow-lg shadow-primary/20">
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </CardContent>
         </Card>

         <Card className="glass md:col-span-3 border-destructive/20 mt-4">
           <CardContent className="flex flex-col sm:flex-row items-center justify-between p-6">
              <div className="flex items-center text-destructive mb-4 sm:mb-0">
                 <ShieldAlert className="h-8 w-8 mr-4 opacity-80" />
                 <div>
                   <h4 className="font-semibold text-sm">Danger Zone</h4>
                   <p className="text-xs text-destructive/70 mt-1">Permanently delete your account and all data.</p>
                 </div>
              </div>
              <Button variant="destructive" className="w-full sm:w-auto hover:bg-destructive shadow-lg shadow-destructive/20 border border-destructive">
                Delete Account
              </Button>
           </CardContent>
         </Card>
      </div>
    </div>
  );
}
