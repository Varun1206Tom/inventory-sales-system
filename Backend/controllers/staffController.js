const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.createStaff = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const hashed = await bcrypt.hash(password, 10);

        const staff = await User.create({
            name,
            email,
            password: hashed,
            role: "staff"
        });

        res.json(staff);
    } catch {
        res.status(400).json({ message: "Staff creation failed" });
    }
};

exports.editStaff = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const staff = await User.findById(req.params.id);
        if (!staff) return res.status(404).json({ message: "Staff not found" });

        staff.name = name || staff.name;
        staff.email = email || staff.email;
        if (password) {
            const bcrypt = require('bcryptjs');
            staff.password = await bcrypt.hash(password, 10);
        }

        await staff.save();
        res.json(staff);
    } catch (err) {
        res.status(400).json({ message: "Failed to update staff" });
    }
};

exports.getStaff = async (req, res) => {
    const staff = await User.find({ role: "staff" });
    res.json(staff);
};

exports.deleteStaff = async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Staff removed" });
};

exports.toggleStaffAccess = async (req, res) => {
    try {
        const staff = await User.findById(req.params.id);
        if (!staff) return res.status(404).json({ message: "Staff not found" });

        staff.isActive = !staff.isActive;
        await staff.save();

        res.json({ message: `Staff ${staff.isActive ? 'enabled' : 'disabled'}`, staff });
    } catch (err) {
        res.status(400).json({ message: "Failed to update staff access" });
    }
};