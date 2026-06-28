import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import styles from "./userProfile.module.css";
import { getProfile, userAuth } from "../../hooks";

interface FormData {
    bio: string;
    major: string;
    year: string;
    modulesTaken: string;
    modulesToTake: string;
}

export default function UserProfile() {
    const { profile, loadProfileInfo } = getProfile();
    const { getToken } = userAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<FormData>({
        bio: "",
        major: "",
        year: "",
        modulesTaken: "",
        modulesToTake: "",
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
                    modulesTaken: data.modulesTaken?.join(", ") || "",
                    modulesToTake: data.modulesToTake?.join(", ") || "",
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

        const updatedFields: Record<string, any> = {};
        if (formData.bio) updatedFields.bio = formData.bio;
        if (formData.major) updatedFields.major = formData.major;
        if (formData.year) updatedFields.year = Number(formData.year);
        if (formData.modulesTaken) updatedFields.modulesTaken = formData.modulesTaken.split(",").map((s) => s.trim()).filter(Boolean);
        if (formData.modulesToTake) updatedFields.modulesToTake = formData.modulesToTake.split(",").map((s) => s.trim()).filter(Boolean);

        const res = await fetch("http://localhost:8000/profile/me", {
            method: "PATCH",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(updatedFields),
        });

        setSaving(false);
        if (res.ok) {
            setSaved(true);
            await loadProfileInfo();
            setTimeout(() => setSaved(false), 2000);
        }
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
                    <label className={styles["label"]}>Modules Taken</label>
                    <input
                        className={styles["input"]}
                        name="modulesTaken"
                        value={formData.modulesTaken}
                        onChange={handleChange}
                        placeholder="e.g. CS1101S, CS1231S"
                    />
                </div>

                <div className={styles["field"]}>
                    <label className={styles["label"]}>Modules to Take</label>
                    <input
                        className={styles["input"]}
                        name="modulesToTake"
                        value={formData.modulesToTake}
                        onChange={handleChange}
                        placeholder="e.g. CS2103T, CS2101"
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