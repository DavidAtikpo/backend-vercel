import children from "../models/childrenModel.js";
import User from "../models/userModel.js";

// Créer des informations sur les enfants
const createChildren = async (req, res) => {
    const userId = req.user;
    try {
        const childInfo = req.body;
        
        // Vérifier si les données existent déjà
        const existingChild = await children.findOne(childInfo);
        if (existingChild) {
            return res.status(400).json({ success: false, message: 'This child is already registered.' });
        }

        // Vérifier si l'utilisateur existe
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found.' });
        }

        // Enregistrer l'ID de l'utilisateur avec les informations sur l'enfant
        const childrenField = { ...childInfo, postedBy: user._id };
        const createdChild = await children.create(childrenField);

        res.status(200).json({ success: true, message: 'Child information created successfully.', data: createdChild });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// get all the children

const getAllChildren = async (req, res) => {
  const userId = req.user;

  try {
    // Find the user who is making the request
    const findUser = await User.findById(userId);
    if (!findUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find all children and populate the 'postedBy' field to get user details
    const allChildren = await children.find().populate('postedBy', 'firstName');
    res.json(allChildren);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

  
 // delete children infortmation

 const deleteChild = async (req, res) => {
    const userId = req.user;
    const { id } = req.params; // Access the parameter 'id' directly
    try {
        const existingUser = await User.findById(userId); // Use 'findById' instead of 'findOne' and pass 'userId' directly
        if (!existingUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        const findChild = await children.findById(id); // Use 'findById' to find the child by its '_id'
        if (findChild) {
            await findChild.remove(); // Use 'remove' method to delete the child
            return res.status(200).json({ message: 'Child deleted successfully' });
        } else {
            return res.status(404).json({ message: 'Child not found' });
        }
    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({ message: 'Internal server error' });
    }
}

// update the child information

const updateChild = async (req, res) => {
    try {
        // Vérifier si req.user est défini et si la propriété id est disponible
        // if (!req.user || !req.user.id) {
        //     return res.status(401).json({ message: "Unauthorized" });
        // }
        
        const userId = req.user.id;
        const _id = req.params.id; // Assure-toi de récupérer correctement l'identifiant de l'enfant à mettre à jour
        console.log('childId',_id);
        const existingUser = await User.findById(userId);
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const updatedChild = await children.findByIdAndUpdate(_id, req.body, { new: true });
        console.log("body",req.body);
        if (updatedChild) {
            return res.status(200).json({ message: "Updated successfully", updatedChild });
        } else {
            return res.status(404).json({ message: "Child not found" });
        }
    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({ message: "Internal server error" });
    }
}


// show the child birth day to the user

const birthDay = async (req, res) => {
    const userId = req.user;
    try {
        const findUser = await User.findById(userId);
        if (!findUser) {
            return res.status(404).json({ message: "User not found" });
        }
        
        const today = new Date();
        const currentMonth = today.getMonth() + 1; // Les mois commencent à partir de 0, donc ajoutez 1
        const currentDay = today.getDate();
        
        const findChildren = await children.find({
            postedBy: userId,
            $expr: {
                $eq: [{ $month: "$birthDate" }, currentMonth],
                $eq: [{ $dayOfMonth: "$birthDate" }, currentDay]
            }
        });
        
        if (findChildren.length === 0) {
            return res.status(404).json({ message: "No children found with birthday today" });
        }
        
        return res.status(200).json({ message: "Children found with birthday today", children: findChildren });
    } catch (error) {
        console.error(error); // Journalisez l'erreur pour le débogage
        return res.status(500).json({ message: "Internal server error" });
    }
};

const baseUrl = 'http://localhost:8000'; // Replace with your actual base URL

// Function to get profile photo URL
const getProfilePhotoURL = async (req, res) => {
  const _id = req.params.id
  try {
    // Find the user by ID
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get the profile photo URL from the database
    const profilePhotoUrl = user.profilePhotoURL;

    // Prepend the base URL to the profile photo URL
    const fullUrl = baseUrl + profilePhotoUrl;

    // Return the profile photo URL
    res.status(200).json({ profilePhotoUrl: fullUrl });
  } catch (error) {
    console.error('Error getting profile photo URL:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

//trow child first name and profile when the child have 22 years count from the day they registed 


export default { createChildren,getAllChildren,deleteChild,updateChild,birthDay,getProfilePhotoURL };
