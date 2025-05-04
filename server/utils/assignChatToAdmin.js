const { ObjectId } = require('mongodb');

async function assignChatToAdmin(users, admins, settings, userId, userObj = {}) {
    const allAdmins = await admins.find({ isActive: { $ne: false } }).sort({ _id: 1 }).toArray();
    if (!allAdmins.length) throw new Error('No admins available for assignment');
    const settingsDoc = await settings.findOne({ _id: 'roundRobin' });
    const lastIndex = settingsDoc ? settingsDoc.lastAssignedAdminIndex : -1;
    const nextIndex = (lastIndex + 1) % allAdmins.length;
    const assignedAdmin = allAdmins[nextIndex];
    // Only assign if not already assigned
    const user = await users.findOne({ _id: userId });
    if (!user || !user.assignedAdminId) {
        await users.updateOne(
            { _id: userId },
            { $set: { ...userObj, assignedAdminId: assignedAdmin._id } },
            { upsert: true }
        );
        await settings.updateOne(
            { _id: 'roundRobin' },
            { $set: { lastAssignedAdminIndex: nextIndex } }
        );
    }
    return assignedAdmin;
}

module.exports = assignChatToAdmin; 