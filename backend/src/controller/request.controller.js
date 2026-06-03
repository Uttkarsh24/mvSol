import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import sendEmail from "../utils/nodemailer/request.js";
import Contact from "../models/contacts.models.js";

const makeRequest = asyncHandler(async (req, res) => {
    const { name, email, phone, message } = req.body;

    if (!name || !name.trim()) {
        return res.status(400).json({ success: false, message: 'Name is required.' });
    }
    if (!email || !email.trim()) {
        return res.status(400).json({ success: false, message: 'Email address is required.' });
    }
    // Basic email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
        return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }
    if (!message || !message.trim()) {
        return res.status(400).json({ success: false, message: 'Message details are required.' });
    }

    try {
        const request = await Contact.create({
            name: name.trim(),
            email: email.trim(),
            phone: phone ? phone.trim() : '',
            message: message.trim()
        });

        await sendEmail("mvservsol@outlook.com", "New Contact Request", `You have received a new contact request from ${request.name} (${request.email}). Message: ${request.message}`);

        return res
        .status(200)
        .json(new ApiResponse(200, request, "Your request has been submitted successfully!"));

    } catch (error) {
        console.error('Error processing request:', error);
        throw new ApiError(500, 'An error occurred while processing your request. Please try again later.');
    }
});

const getAllRequests = asyncHandler(async (req, res) => {
    try {
        const requests = await Contact.find().sort({ createdAt: -1 });
        await sendEmail(process.env.SMTP_USER, "New Contact Request", `There are currently ${requests.length} contact requests in the system.`);
        return res
            .status(200)
            .json(new ApiResponse(200, requests, "All requests retrieved successfully!"));
    } catch (error) {
        console.error('Error retrieving requests:', error);
        throw new ApiError(500, 'An error occurred while retrieving requests. Please try again later.');
    }
});

const getRequestById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const request = await Contact.findById(id);
        if (!request) {
            return res.status(404).json(new ApiResponse(404, null, "Request not found."));
        }
        return res
            .status(200)
            .json(new ApiResponse(200, request, "Request retrieved successfully!"));
    } catch (error) {
        console.error('Error retrieving request:', error);
        throw new ApiError(500, 'An error occurred while retrieving the request. Please try again later.');
    }
});



export { makeRequest , getAllRequests , getRequestById};

