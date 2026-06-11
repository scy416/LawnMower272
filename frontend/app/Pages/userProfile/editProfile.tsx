import { useState } from "react";
import { useNavigate } from "react-router";
import InputBox  from "../../Components/InputBox"
import styles from "./editProfile.module.css"
import { userAuth } from "~/userAuth";

export default function EditProfile() {
    const navigate = useNavigate()
    const [bio, setBio] = useState("")
    const [major, setMajor] = useState("")
    const [year, setYear] = useState("")

    const { getToken } = userAuth()

    const updateProfile = async() => {
        const token = getToken();
        if (!token) return;

        const res = await fetch("http://localhost:8000/profile/me", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ bio, major, year: parseInt(year) })
        });

        if (res.ok) {
            navigate("/Profile");
        }
    }

    return (
        <div className={styles['page']}>
            <div className={styles['card']}>
                <h1 className={styles['title']}>Edit profile</h1>
                    <InputBox outerStyle={styles['field-wrapper']} innerStyle={styles['input-box']} 
                        label="Bio" value={bio} onChange={setBio} placeholder="Tell us about yourself" />
                    <InputBox outerStyle={styles['field-wrapper']} innerStyle={styles['input-box']} 
                        label="Major" value={major} onChange={setMajor} placeholder="e.g. Computer Science" />
                    <InputBox outerStyle={styles['field-wrapper']} innerStyle={styles['input-box']} 
                        label="Year" value={year} onChange={setYear} placeholder="e.g. 2" type="number" />
            </div>

            <div className={styles['buttons']}>
                <button className={styles['buttons-indiv']} onClick={() => navigate("/Profile")}>Cancel</button>
                <button className={styles['buttons-indiv']} onClick={updateProfile}>Save</button>
            </div>
        </div>
    )
}