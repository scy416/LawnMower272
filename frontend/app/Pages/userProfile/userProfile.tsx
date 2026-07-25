import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import styles from "./userProfile.module.css";
import { getProfile, userAuth } from "../../hooks";
import { ModuleSelector } from "~/Components/moduleSelector";
import { fetchModuleSuggestions } from "~/utils";
import { API_URL } from "~/config";

interface FormData {
    bio: string;
    major: string;
    year: string;
    modulesTaken: string[];
    modulesToTake: string[];
}

export default function UserProfile() {
    const { profile, loadProfileInfo } = getProfile();
    const { getToken } = userAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<FormData>({
        bio: "",
        major: "",
        year: "",
        modulesTaken: [],
        modulesToTake: [],
    });
    
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const load = async () => {
            const data = await loadProfileInfo();
            if (data) {
                setFormData({
                    bio: data.bio || "",
                    major: data.major || "",
                    year: data.year ? String(data.year) : "",
                    modulesTaken: data.modulesTaken || [],
                    modulesToTake: data.modulesToTake || [],
                });
            }
        };
        load();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        const token = getToken();
        if (!token) return;
        setSaving(true);

        const updatedFields = {
            bio: formData.bio,
            major: formData.major,
            year: formData.year ? Number(formData.year) : null, 
            modulesTaken: formData.modulesTaken,
            modulesToTake: formData.modulesToTake,
        };

        try {
            const res = await fetch(`${API_URL}/profile/me`, {
                method: "PATCH",
                headers: { 
                    "Content-Type": "application/json", 
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify(updatedFields),
            });

            setSaving(false);

            if (res.ok) {
                setSaved(true);
                await loadProfileInfo(); 
                setTimeout(() => setSaved(false), 2000);
            } else {
                const errorData = await res.json();
                console.error("Backend rejected the save:", errorData);
                alert("Failed to save! Check the F12 console for the exact error.");
            }
        } catch (err) {
            setSaving(false);
            console.error("Network error while saving:", err);
        }
    };

    const handleAddModule = (listName: "modulesTaken" | "modulesToTake", mod: string) => {
        if (!mod) return;
        setFormData(prev => {
            if (prev[listName].includes(mod)) return prev;
            return { ...prev, [listName]: [...prev[listName], mod] };
        });
    };

    const handleRemoveModule = (listName: "modulesTaken" | "modulesToTake", modToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            [listName]: prev[listName].filter(m => m !== modToRemove)
        }));
    };

    if (!profile) return <p className={styles["muted"]}>Loading...</p>;

    return (
        <div className={styles["card"]}>
            <div className={styles["top-actions"]}>
                <button
                    className={styles["home-btn"]}
                    onClick={() => navigate("/timetable")}
                >
                    Home
                </button>
            </div>

            <div className={styles["header-container"]}>
                <div className={styles["avatar"]}>
                    {profile.username.slice(0, 2).toUpperCase()}
                </div>
                <h2 className={styles["username"]}>{profile.username}</h2>
            </div>

            <div className={styles["edit-form"]}>
                <div className={styles["field"]}>
                    <label className={styles["label"]}>Bio</label>
                    <textarea
                        className={styles["input"]}
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Tell us about yourself"
                        rows={3}
                    />
                </div>

                <div className={styles["field-row"]}>
                    <div className={styles["field"]}>
                        <label className={styles["label"]}>Major</label>
                        <input
                            className={styles["input"]}
                            name="major"
                            value={formData.major}
                            onChange={handleChange}
                            placeholder="e.g. Computer Science"
                        />
                    </div>
                    <div className={styles["field"]}>
                        <label className={styles["label"]}>Year</label>
                        <input
                            className={styles["input"]}
                            type="number"
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            placeholder="e.g. 2"
                        />
                    </div>
                </div>

                <div className={styles["field"]}>
                    <ModuleSelector 
                    label="Modules Taken"
                    modules={formData.modulesTaken}
                    onAdd={(val) => handleAddModule("modulesTaken", val)}
                    onRemove={(val) => handleRemoveModule("modulesTaken", val)}
                    fetchSuggestions={(query) => fetchModuleSuggestions(query, getToken())}
                    />
                </div>

                <div className={styles["field"]}>
                    <ModuleSelector 
                    label="Modules to Take"
                    modules={formData.modulesToTake}
                    onAdd={(val) => handleAddModule("modulesToTake", val)}
                    onRemove={(val) => handleRemoveModule("modulesToTake", val)}
                    fetchSuggestions={(query) => fetchModuleSuggestions(query, getToken())}
                    />
                </div>

                <button
                    className={`${styles["save-btn"]} ${saved ? styles["saved"] : ""}`}
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? "Saving..." : saved ? "✓ Saved!" : "Save"}
                </button>
            </div>
        </div>
    );
}