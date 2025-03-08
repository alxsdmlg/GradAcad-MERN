import { getDB } from "../config/db.js";

export const getSubjectsByUsername = async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ message: "Username is required" });
    }

    try {
        const db = getDB();
        const collection = db.collection("instructors");

        const result = await collection.findOne(
            { [username]: { $exists: true } },
            { projection: { [username]: 1, _id: 0 } }
        );

        if (result) {
            res.status(200).json({ success: true, subjects: result[username] })
        } else {
            return res.status(404).json({ success: false, message: "No data found for the given username" });
        };
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getAcadYrSem = async (req, res) => {

    const db = getDB();

    try {
        const YrSem = await db.collection('global')
            .findOne(
                { acadYr: { $exists: true }, sem: { $exists: true } }, // Filter for documents with acadYr and sem fields
                { projection: { acadYr: 1, sem: 1, _id: 0 } } // Include only acadYr and sem fields in the result
            );
    
        if (YrSem) {
            res.json({ success: true, data: YrSem });
        } else {
            res.status(404).json({ success: false, message: 'No matching document found' });
        }
    } catch (err) {
        console.error('Error fetching academic year and semester:', err);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
