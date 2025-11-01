const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide your name']
    },
    address: {
        type: String,
        required: [true, 'Please provide your address']
    },
    mobile: {
        type: String,
        required: [true, 'Please provide your mobile number'],
        unique: true
    },
    email: {
        type: String,
        unique: true,
        sparse: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password']
    },
    resetToken: String,
    resetTokenExpiry: Date
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Method to check password
userSchema.methods.verifyPassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

async function createUser(userData) {
    try {
        const user = new User(userData);
        await user.save();
        const userObject = user.toObject();
        delete userObject.password;
        return userObject;
    } catch (error) {
        throw error;
    }
}

async function findUserByMobile(mobile) {
    return await User.findOne({ mobile });
}

async function findUserById(id) {
    return await User.findById(id).select('-password');
}

async function verifyPassword(user, candidatePassword) {
    if (!user) return false;
    return await user.verifyPassword(candidatePassword);
}

async function findUserByEmail(email) {
    return await User.findOne({ email });
}

async function updateUserPassword(userId, newPassword) {
    const user = await User.findById(userId);
    if (!user) throw new Error('User not found');
    user.password = newPassword;
    await user.save();
    return user;
}

module.exports = {
    createUser,
    findUserByMobile,
    findUserById,
    verifyPassword,
    findUserByEmail,
    updateUserPassword
};


