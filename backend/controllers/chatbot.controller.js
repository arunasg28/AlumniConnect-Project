import User from "../models/user.model.js";

export const handleChatbotRequest = async (req, res) => {
  const { message } = req.body;

  const keyword = "details of student ";  // Updated keyword
  const nameIndex = message.toLowerCase().indexOf(keyword);

  if (nameIndex === -1) {
    return res.json({ reply: "Please ask like: Details of student [Name]" });
  }

  const studentName = message.substring(nameIndex + keyword.length).trim();

  try {
    console.log("Searching for student:", studentName);

    const student = await User.findOne({
      name: { $regex: new RegExp(studentName, "i") },
    });

    if (!student) {
      return res.json({ reply: "Student not found." });
    }

    if (!student.contactDetails || student.contactDetails.length === 0) {
      return res.json({ reply: "Student contact details not available." });
    }

    const details = student.contactDetails[0]; // Assuming we are getting the first contact details

    // Formatting the response with line breaks
    const reply = `
      Name: ${student.name}
      Email: ${student.email}
      Reg No: ${details.registerNo}
      Phone: ${details.phoneNo}
      Dept: ${details.department}
      Batch: ${details.batch}
    `;

    console.log("Student found:", reply);

    return res.json({ reply });
  } catch (error) {
    console.error("Chatbot error:", error);
    return res.status(500).json({ reply: "Server error. Please try again later." });
  }
};
